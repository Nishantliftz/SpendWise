package com.spendwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendResponse {

    private String month;
    private int monthNumber;
    private int year;
    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal savings;
}
