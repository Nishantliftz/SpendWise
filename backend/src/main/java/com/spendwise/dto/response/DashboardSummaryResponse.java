package com.spendwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private BigDecimal totalBalance;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal monthlySavings;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlyBudget;
    private Double budgetUsageProgress;
    private List<TransactionResponse> recentTransactions;
    private List<BudgetResponse> budgetSummary;
    private List<SavingsGoalResponse> savingsGoals;
    private List<CategoryBreakdownResponse> categoryBreakdown;
    private List<MonthlyTrendResponse> monthlyTrends;
}
