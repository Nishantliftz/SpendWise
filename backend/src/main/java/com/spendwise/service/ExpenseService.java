package com.spendwise.service;

import com.spendwise.dto.request.ExpenseRequest;
import com.spendwise.dto.response.ExpenseResponse;
import com.spendwise.dto.response.PagedResponse;
import com.spendwise.entity.Budget;
import com.spendwise.entity.Expense;
import com.spendwise.entity.Notification;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.exception.UnauthorizedException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    public List<ExpenseResponse> getAllExpenses(String category, LocalDate startDate, LocalDate endDate, String search) {
        User user = authService.getCurrentUser();
        List<Expense> expenses;

        if (search != null && !search.isBlank()) {
            expenses = expenseRepository.findByUserIdAndDescriptionContainingIgnoreCaseOrderByTransactionDateDesc(user.getId(), search.trim());
        } else if (startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(user.getId(), startDate, endDate);
        } else {
            expenses = expenseRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
        }

        if (category != null && !category.isBlank()) {
            expenses = expenses.stream()
                    .filter(e -> category.equalsIgnoreCase(e.getCategory()))
                    .collect(Collectors.toList());
        }

        return expenses.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PagedResponse<ExpenseResponse> getExpensesPaged(int page, int size) {
        User user = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Expense> expensePage = expenseRepository.findByUserId(user.getId(), pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ExpenseResponse>builder()
                .content(content)
                .page(expensePage.getNumber())
                .size(expensePage.getSize())
                .totalElements(expensePage.getTotalElements())
                .totalPages(expensePage.getTotalPages())
                .last(expensePage.isLast())
                .build();
    }

    public ExpenseResponse getExpenseById(Long id) {
        User user = authService.getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        if (!expense.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this record");
        }

        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest request) {
        User user = authService.getCurrentUser();

        Expense expense = Expense.builder()
                .userId(user.getId())
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .transactionDate(request.getTransactionDate())
                .notes(request.getNotes())
                .build();

        Expense saved = expenseRepository.save(expense);

        // Check budget warnings
        checkBudgetLimit(user.getId(), saved.getCategory(), saved.getTransactionDate());

        return mapToResponse(saved);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        User user = authService.getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        if (!expense.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this record");
        }

        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setNotes(request.getNotes());

        Expense updated = expenseRepository.save(expense);
        checkBudgetLimit(user.getId(), updated.getCategory(), updated.getTransactionDate());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteExpense(Long id) {
        User user = authService.getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));

        if (!expense.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this record");
        }

        expenseRepository.delete(expense);
    }

    private void checkBudgetLimit(Long userId, String category, LocalDate date) {
        int month = date.getMonthValue();
        int year = date.getYear();

        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, category, month, year);
        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            BigDecimal totalSpent = expenseRepository.sumByUserIdAndCategoryAndMonthAndYear(userId, category, month, year);
            if (totalSpent == null) totalSpent = BigDecimal.ZERO;

            if (budget.getMonthlyLimit().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal ratio = totalSpent.divide(budget.getMonthlyLimit(), 4, RoundingMode.HALF_UP);
                if (ratio.compareTo(new BigDecimal("1.0")) >= 0) {
                    Notification notification = Notification.builder()
                            .userId(userId)
                            .message("Warning: You have reached 100% of your budget for " + category + " ($" + totalSpent + " / $" + budget.getMonthlyLimit() + ")")
                            .notificationType("BUDGET_EXCEEDED")
                            .isRead(false)
                            .build();
                    notificationRepository.save(notification);
                } else if (ratio.compareTo(new BigDecimal("0.80")) >= 0) {
                    Notification notification = Notification.builder()
                            .userId(userId)
                            .message("Alert: You have reached " + ratio.multiply(BigDecimal.valueOf(100)).intValue() + "% of your budget for " + category)
                            .notificationType("BUDGET_WARNING")
                            .isRead(false)
                            .build();
                    notificationRepository.save(notification);
                }
            }
        }
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .userId(expense.getUserId())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .paymentMethod(expense.getPaymentMethod())
                .transactionDate(expense.getTransactionDate())
                .notes(expense.getNotes())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}
