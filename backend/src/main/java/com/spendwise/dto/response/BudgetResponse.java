package com.spendwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {

    private Long id;
    private Long userId;
    private String category;
    private BigDecimal monthlyLimit;
    private Integer month;
    private Integer year;
    private BigDecimal spent;
    private BigDecimal remaining;
    private Double percentageUsed;
    private LocalDateTime createdAt;
}
