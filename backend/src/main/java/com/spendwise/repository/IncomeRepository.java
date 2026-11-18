package com.spendwise.repository;

import com.spendwise.entity.Income;
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
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserIdOrderByTransactionDateDesc(Long userId);

    Page<Income> findByUserId(Long userId, Pageable pageable);

    List<Income> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, LocalDate start, LocalDate end);

    List<Income> findByUserIdAndCategoryOrderByTransactionDateDesc(Long userId, String category);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.userId = :userId " +
           "AND MONTH(i.transactionDate) = :month AND YEAR(i.transactionDate) = :year")
    BigDecimal sumByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.userId = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT i.category, SUM(i.amount) FROM Income i WHERE i.userId = :userId " +
           "AND YEAR(i.transactionDate) = :year AND MONTH(i.transactionDate) = :month " +
           "GROUP BY i.category")
    List<Object[]> getCategoryBreakdownByUserIdAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);
}
