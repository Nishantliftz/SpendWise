package com.spendwise.repository;

import com.spendwise.entity.SavingsContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SavingsContributionRepository extends JpaRepository<SavingsContribution, Long> {

    List<SavingsContribution> findByGoalIdOrderByContributionDateDesc(Long goalId);

    @Query("SELECT SUM(sc.amount) FROM SavingsContribution sc WHERE sc.goalId = :goalId")
    BigDecimal sumByGoalId(@Param("goalId") Long goalId);
}
