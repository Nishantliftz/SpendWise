package com.spendwise.controller;

import com.spendwise.dto.request.ExpenseRequest;
import com.spendwise.dto.response.ApiResponse;
import com.spendwise.dto.response.ExpenseResponse;
import com.spendwise.dto.response.PagedResponse;
import com.spendwise.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Tag(name = "Expense Management", description = "Endpoints for managing user expense records")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    @Operation(summary = "Get list of expenses with optional category, date range, search, or pagination")
    public ResponseEntity<ApiResponse<?>> getExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        if (page != null) {
            PagedResponse<ExpenseResponse> paged = expenseService.getExpensesPaged(page, size);
            return ResponseEntity.ok(ApiResponse.success(paged));
        }
        List<ExpenseResponse> list = expenseService.getAllExpenses(category, startDate, endDate, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single expense record by ID")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long id) {
        ExpenseResponse response = expenseService.getExpenseById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new expense record")
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense record created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense record")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense record updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense record")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense record deleted successfully", null));
    }
}
