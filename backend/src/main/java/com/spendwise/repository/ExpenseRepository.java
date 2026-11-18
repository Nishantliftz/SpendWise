package com.spendwise.repository;

import com.spendwise.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByTransactionDateDesc(Long userId);

    Page<Expense> findByUserId(Long userId, Pageable pageable);

    List<Expense> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, LocalDate start, LocalDate end);

    List<Expense> findByUserIdAndDescriptionContainingIgnoreCaseOrderByTransactionDateDesc(
            Long userId, String description);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId " +
           "AND MONTH(e.transactionDate) = :month AND YEAR(e.transactionDate) = :year")
    BigDecimal sumByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.userId = :userId " +
           "AND YEAR(e.transactionDate) = :year AND MONTH(e.transactionDate) = :month " +
           "GROUP BY e.category")
    List<Object[]> getCategoryBreakdownByUserIdAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId " +
           "AND e.category = :category " +
           "AND MONTH(e.transactionDate) = :month AND YEAR(e.transactionDate) = :year")
    BigDecimal sumByUserIdAndCategoryAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("month") int month,
            @Param("year") int year);
}
