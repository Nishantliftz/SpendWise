package com.spendwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private Long userId;
    private BigDecimal amount;
    private String category;
    private String description;
    private String paymentMethod;
    private LocalDate transactionDate;
    private String notes;
    private LocalDateTime createdAt;
}
