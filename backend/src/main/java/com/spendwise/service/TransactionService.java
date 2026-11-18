package com.spendwise.service;

import com.spendwise.dto.response.PagedResponse;
import com.spendwise.dto.response.TransactionResponse;
import com.spendwise.entity.Expense;
import com.spendwise.entity.Income;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final AuthService authService;

    public PagedResponse<TransactionResponse> getTransactions(
            String type,
            String category,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            String sortBy,
            int page,
            int size
    ) {
        User user = authService.getCurrentUser();
        List<TransactionResponse> list = new ArrayList<>();

        boolean includeIncome = type == null || type.isBlank() || "all".equalsIgnoreCase(type) || "income".equalsIgnoreCase(type);
        boolean includeExpense = type == null || type.isBlank() || "all".equalsIgnoreCase(type) || "expense".equalsIgnoreCase(type);

        if (includeIncome) {
            List<Income> incomes = incomeRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
            for (Income inc : incomes) {
                list.add(TransactionResponse.builder()
                        .id(inc.getId())
                        .type("income")
                        .amount(inc.getAmount())
                        .category(inc.getCategory())
                        .description(inc.getDescription())
                        .paymentMethod(inc.getPaymentMethod())
                        .transactionDate(inc.getTransactionDate())
                        .createdAt(inc.getCreatedAt())
                        .build());
            }
        }

        if (includeExpense) {
            List<Expense> expenses = expenseRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
            for (Expense exp : expenses) {
                list.add(TransactionResponse.builder()
                        .id(exp.getId())
                        .type("expense")
                        .amount(exp.getAmount())
                        .category(exp.getCategory())
                        .description(exp.getDescription())
                        .paymentMethod(exp.getPaymentMethod())
                        .transactionDate(exp.getTransactionDate())
                        .notes(exp.getNotes())
                        .createdAt(exp.getCreatedAt())
                        .build());
            }
        }

        // Filtering
        list = list.stream()
                .filter(t -> {
                    if (category != null && !category.isBlank() && !t.getCategory().equalsIgnoreCase(category)) {
                        return false;
                    }
                    if (startDate != null && t.getTransactionDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && t.getTransactionDate().isAfter(endDate)) {
                        return false;
                    }
                    if (search != null && !search.isBlank()) {
                        String s = search.toLowerCase();
                        boolean matchesDesc = t.getDescription() != null && t.getDescription().toLowerCase().contains(s);
                        boolean matchesCat = t.getCategory() != null && t.getCategory().toLowerCase().contains(s);
                        return matchesDesc || matchesCat;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // Sorting
        Comparator<TransactionResponse> comparator;
        if ("amount_asc".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(TransactionResponse::getAmount);
        } else if ("amount_desc".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(TransactionResponse::getAmount).reversed();
        } else if ("date_asc".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(TransactionResponse::getTransactionDate);
        } else {
            // Default date_desc
            comparator = Comparator.comparing(TransactionResponse::getTransactionDate).reversed();
        }
        list.sort(comparator);

        // Pagination
        long totalElements = list.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int fromIndex = Math.min(page * size, list.size());
        int toIndex = Math.min(fromIndex + size, list.size());
        List<TransactionResponse> pagedList = list.subList(fromIndex, toIndex);

        return PagedResponse.<TransactionResponse>builder()
                .content(pagedList)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(page >= totalPages - 1)
                .build();
    }

    public TransactionResponse getTransaction(String type, Long id) {
        User user = authService.getCurrentUser();
        if ("income".equalsIgnoreCase(type)) {
            Income inc = incomeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
            return TransactionResponse.builder()
                    .id(inc.getId())
                    .type("income")
                    .amount(inc.getAmount())
                    .category(inc.getCategory())
                    .description(inc.getDescription())
                    .paymentMethod(inc.getPaymentMethod())
                    .transactionDate(inc.getTransactionDate())
                    .createdAt(inc.getCreatedAt())
                    .build();
        } else {
            Expense exp = expenseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
            return TransactionResponse.builder()
                    .id(exp.getId())
                    .type("expense")
                    .amount(exp.getAmount())
                    .category(exp.getCategory())
                    .description(exp.getDescription())
                    .paymentMethod(exp.getPaymentMethod())
                    .transactionDate(exp.getTransactionDate())
                    .notes(exp.getNotes())
                    .createdAt(exp.getCreatedAt())
                    .build();
        }
    }
}
