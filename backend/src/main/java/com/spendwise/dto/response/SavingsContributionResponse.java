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
public class SavingsContributionResponse {

    private Long id;
    private Long goalId;
    private BigDecimal amount;
    private LocalDate contributionDate;
    private String description;
    private LocalDateTime createdAt;
}
