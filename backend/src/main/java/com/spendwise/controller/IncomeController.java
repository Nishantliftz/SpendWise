package com.spendwise.controller;

import com.spendwise.dto.request.IncomeRequest;
import com.spendwise.dto.response.ApiResponse;
import com.spendwise.dto.response.IncomeResponse;
import com.spendwise.dto.response.PagedResponse;
import com.spendwise.service.IncomeService;
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
@RequestMapping("/api/income")
@RequiredArgsConstructor
@Tag(name = "Income Management", description = "Endpoints for managing user income sources and records")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping
    @Operation(summary = "Get list of income records with optional filters or pagination")
    public ResponseEntity<ApiResponse<?>> getIncomes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        if (page != null) {
            PagedResponse<IncomeResponse> paged = incomeService.getIncomesPaged(page, size);
            return ResponseEntity.ok(ApiResponse.success(paged));
        }
        List<IncomeResponse> list = incomeService.getAllIncomes(category, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single income record by ID")
    public ResponseEntity<ApiResponse<IncomeResponse>> getIncomeById(@PathVariable Long id) {
        IncomeResponse response = incomeService.getIncomeById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new income record")
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(@Valid @RequestBody IncomeRequest request) {
        IncomeResponse response = incomeService.createIncome(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Income record created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing income record")
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request
    ) {
        IncomeResponse response = incomeService.updateIncome(id, request);
        return ResponseEntity.ok(ApiResponse.success("Income record updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an income record")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.ok(ApiResponse.success("Income record deleted successfully", null));
    }
}
