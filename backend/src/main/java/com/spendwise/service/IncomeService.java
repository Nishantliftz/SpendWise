package com.spendwise.service;

import com.spendwise.dto.request.IncomeRequest;
import com.spendwise.dto.response.IncomeResponse;
import com.spendwise.dto.response.PagedResponse;
import com.spendwise.entity.Income;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.exception.UnauthorizedException;
import com.spendwise.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final AuthService authService;

    public List<IncomeResponse> getAllIncomes(String category, LocalDate startDate, LocalDate endDate) {
        User user = authService.getCurrentUser();
        List<Income> incomes;

        if (startDate != null && endDate != null) {
            incomes = incomeRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(user.getId(), startDate, endDate);
        } else if (category != null && !category.isBlank()) {
            incomes = incomeRepository.findByUserIdAndCategoryOrderByTransactionDateDesc(user.getId(), category);
        } else {
            incomes = incomeRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
        }

        return incomes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PagedResponse<IncomeResponse> getIncomesPaged(int page, int size) {
        User user = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<Income> incomePage = incomeRepository.findByUserId(user.getId(), pageable);

        List<IncomeResponse> content = incomePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<IncomeResponse>builder()
                .content(content)
                .page(incomePage.getNumber())
                .size(incomePage.getSize())
                .totalElements(incomePage.getTotalElements())
                .totalPages(incomePage.getTotalPages())
                .last(incomePage.isLast())
                .build();
    }

    public IncomeResponse getIncomeById(Long id) {
        User user = authService.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        if (!income.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this record");
        }

        return mapToResponse(income);
    }

    @Transactional
    public IncomeResponse createIncome(IncomeRequest request) {
        User user = authService.getCurrentUser();

        Income income = Income.builder()
                .userId(user.getId())
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod())
                .transactionDate(request.getTransactionDate())
                .build();

        Income saved = incomeRepository.save(income);
        return mapToResponse(saved);
    }

    @Transactional
    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        User user = authService.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        if (!income.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this record");
        }

        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setDescription(request.getDescription());
        income.setPaymentMethod(request.getPaymentMethod());
        income.setTransactionDate(request.getTransactionDate());

        Income updated = incomeRepository.save(income);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteIncome(Long id) {
        User user = authService.getCurrentUser();
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with id: " + id));

        if (!income.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this record");
        }

        incomeRepository.delete(income);
    }

    private IncomeResponse mapToResponse(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .userId(income.getUserId())
                .amount(income.getAmount())
                .category(income.getCategory())
                .description(income.getDescription())
                .paymentMethod(income.getPaymentMethod())
                .transactionDate(income.getTransactionDate())
                .createdAt(income.getCreatedAt())
                .build();
    }
}
