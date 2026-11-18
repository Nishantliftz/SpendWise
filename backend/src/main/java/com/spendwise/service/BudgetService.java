package com.spendwise.service;

import com.spendwise.dto.request.BudgetRequest;
import com.spendwise.dto.response.BudgetResponse;
import com.spendwise.entity.Budget;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.exception.UnauthorizedException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
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
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public List<BudgetResponse> getBudgets(Integer month, Integer year) {
        User user = authService.getCurrentUser();
        int targetMonth = (month != null) ? month : LocalDate.now().getMonthValue();
        int targetYear = (year != null) ? year : LocalDate.now().getYear();

        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), targetMonth, targetYear);
        return budgets.stream()
                .map(b -> mapToBudgetResponse(b, targetMonth, targetYear))
                .collect(Collectors.toList());
    }

    public BudgetResponse getBudgetById(Long id) {
        User user = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!budget.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this budget");
        }

        return mapToBudgetResponse(budget, budget.getMonth(), budget.getYear());
    }

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request) {
        User user = authService.getCurrentUser();

        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
                user.getId(), request.getCategory(), request.getMonth(), request.getYear());
        if (existing.isPresent()) {
            throw new BadRequestException("Budget already exists for category " + request.getCategory() +
                    " in " + request.getMonth() + "/" + request.getYear());
        }

        Budget budget = Budget.builder()
                .userId(user.getId())
                .category(request.getCategory())
                .monthlyLimit(request.getMonthlyLimit())
                .month(request.getMonth())
                .year(request.getYear())
                .build();

        Budget saved = budgetRepository.save(budget);
        return mapToBudgetResponse(saved, saved.getMonth(), saved.getYear());
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        User user = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!budget.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this budget");
        }

        budget.setCategory(request.getCategory());
        budget.setMonthlyLimit(request.getMonthlyLimit());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());

        Budget updated = budgetRepository.save(budget);
        return mapToBudgetResponse(updated, updated.getMonth(), updated.getYear());
    }

    @Transactional
    public void deleteBudget(Long id) {
        User user = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!budget.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this budget");
        }

        budgetRepository.delete(budget);
    }

    public BudgetResponse mapToBudgetResponse(Budget budget, int month, int year) {
        BigDecimal spent = expenseRepository.sumByUserIdAndCategoryAndMonthAndYear(
                budget.getUserId(), budget.getCategory(), month, year);
        if (spent == null) spent = BigDecimal.ZERO;

        BigDecimal remaining = budget.getMonthlyLimit().subtract(spent);
        double percentage = 0.0;
        if (budget.getMonthlyLimit().compareTo(BigDecimal.ZERO) > 0) {
            percentage = spent.divide(budget.getMonthlyLimit(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .userId(budget.getUserId())
                .category(budget.getCategory())
                .monthlyLimit(budget.getMonthlyLimit())
                .month(budget.getMonth())
                .year(budget.getYear())
                .spent(spent)
                .remaining(remaining)
                .percentageUsed(percentage)
                .createdAt(budget.getCreatedAt())
                .build();
    }
}
