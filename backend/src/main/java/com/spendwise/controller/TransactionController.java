package com.spendwise.controller;

import com.spendwise.dto.response.ApiResponse;
import com.spendwise.dto.response.PagedResponse;
import com.spendwise.dto.response.TransactionResponse;
import com.spendwise.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Endpoints for unified transaction history, searching and filtering")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get unified transaction history (income + expenses) with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "date_desc") String sortBy,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        PagedResponse<TransactionResponse> response = transactionService.getTransactions(
                type, category, startDate, endDate, search, sortBy, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{type}/{id}")
    @Operation(summary = "Get single transaction details by type (income or expense) and ID")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(
            @PathVariable String type,
            @PathVariable Long id
    ) {
        TransactionResponse response = transactionService.getTransaction(type, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
