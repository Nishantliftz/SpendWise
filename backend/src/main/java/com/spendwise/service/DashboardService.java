package com.spendwise.service;

import com.spendwise.dto.response.*;
import com.spendwise.entity.Budget;
import com.spendwise.entity.Expense;
import com.spendwise.entity.Income;
import com.spendwise.entity.User;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.IncomeRepository;
import com.spendwise.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final BudgetService budgetService;
    private final SavingsService savingsService;
    private final AuthService authService;

    private static final String[] CHART_COLORS = {
            "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
            "#ec4899", "#6366f1", "#f97316", "#14b8a6", "#06b6d4", "#84cc16"
    };

    public DashboardSummaryResponse getSummary() {
        User user = authService.getCurrentUser();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        // Total lifetime values
        BigDecimal totalIncome = incomeRepository.sumTotalByUserId(user.getId());
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpenses = expenseRepository.sumTotalByUserId(user.getId());
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal totalBalance = totalIncome.subtract(totalExpenses);

        // Current month values
        BigDecimal monthlyIncome = incomeRepository.sumByUserIdAndMonthAndYear(user.getId(), currentMonth, currentYear);
        if (monthlyIncome == null) monthlyIncome = BigDecimal.ZERO;

        BigDecimal monthlyExpenses = expenseRepository.sumByUserIdAndMonthAndYear(user.getId(), currentMonth, currentYear);
        if (monthlyExpenses == null) monthlyExpenses = BigDecimal.ZERO;

        BigDecimal monthlySavings = monthlyIncome.subtract(monthlyExpenses);

        // Budget summary
        List<Budget> currentBudgets = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), currentMonth, currentYear);
        List<BudgetResponse> budgetSummary = currentBudgets.stream()
                .map(b -> budgetService.mapToBudgetResponse(b, currentMonth, currentYear))
                .collect(Collectors.toList());

        BigDecimal totalBudgetLimit = budgetSummary.stream()
                .map(BudgetResponse::getMonthlyLimit)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Double budgetProgress = 0.0;
        if (totalBudgetLimit.compareTo(BigDecimal.ZERO) > 0) {
            budgetProgress = monthlyExpenses.divide(totalBudgetLimit, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // Recent transactions (last 10 combined)
        List<TransactionResponse> recentTransactions = getRecentTransactions(user.getId(), 10);

        // Savings goals
        List<SavingsGoalResponse> savingsGoals = savingsService.getSavingsGoals();

        // Category breakdown
        List<CategoryBreakdownResponse> categoryBreakdown = getCategoryBreakdown();

        // Monthly trends
        List<MonthlyTrendResponse> monthlyTrends = getMonthlyTrends();

        return DashboardSummaryResponse.builder()
                .totalBalance(totalBalance)
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .monthlySavings(monthlySavings)
                .monthlyIncome(monthlyIncome)
                .monthlyExpenses(monthlyExpenses)
                .monthlyBudget(totalBudgetLimit)
                .budgetUsageProgress(budgetProgress)
                .recentTransactions(recentTransactions)
                .budgetSummary(budgetSummary)
                .savingsGoals(savingsGoals)
                .categoryBreakdown(categoryBreakdown)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    public List<MonthlyTrendResponse> getMonthlyTrends() {
        User user = authService.getCurrentUser();
        LocalDate now = LocalDate.now();
        List<MonthlyTrendResponse> trends = new ArrayList<>();

        // Last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            int m = monthDate.getMonthValue();
            int y = monthDate.getYear();

            BigDecimal inc = incomeRepository.sumByUserIdAndMonthAndYear(user.getId(), m, y);
            if (inc == null) inc = BigDecimal.ZERO;

            BigDecimal exp = expenseRepository.sumByUserIdAndMonthAndYear(user.getId(), m, y);
            if (exp == null) exp = BigDecimal.ZERO;

            BigDecimal sav = inc.subtract(exp);
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            trends.add(MonthlyTrendResponse.builder()
                    .month(monthName + " " + y)
                    .monthNumber(m)
                    .year(y)
                    .income(inc)
                    .expenses(exp)
                    .savings(sav)
                    .build());
        }

        return trends;
    }

    public List<CategoryBreakdownResponse> getCategoryBreakdown() {
        User user = authService.getCurrentUser();
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        List<Object[]> rows = expenseRepository.getCategoryBreakdownByUserIdAndMonth(user.getId(), year, month);
        BigDecimal total = expenseRepository.sumByUserIdAndMonthAndYear(user.getId(), month, year);
        if (total == null || total.compareTo(BigDecimal.ZERO) == 0) {
            return Collections.emptyList();
        }

        List<CategoryBreakdownResponse> result = new ArrayList<>();
        int colorIdx = 0;

        for (Object[] row : rows) {
            String category = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            double pct = amount.divide(total, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            String color = CHART_COLORS[colorIdx % CHART_COLORS.length];
            colorIdx++;

            result.add(CategoryBreakdownResponse.builder()
                    .category(category)
                    .amount(amount)
                    .percentage(pct)
                    .color(color)
                    .build());
        }

        return result;
    }

    private List<TransactionResponse> getRecentTransactions(Long userId, int limit) {
        List<Income> incomes = incomeRepository.findByUserIdOrderByTransactionDateDesc(userId);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByTransactionDateDesc(userId);

        List<TransactionResponse> list = new ArrayList<>();

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

        list.sort((a, b) -> b.getTransactionDate().compareTo(a.getTransactionDate()));

        if (list.size() > limit) {
            return list.subList(0, limit);
        }
        return list;
    }
}
