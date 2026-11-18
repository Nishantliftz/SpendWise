package com.spendwise.repository;

import com.spendwise.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<RecurringTransaction> findByUserIdAndActiveTrue(Long userId);
}
