package com.spendwise.controller;

import com.spendwise.dto.request.SavingsContributionRequest;
import com.spendwise.dto.request.SavingsGoalRequest;
import com.spendwise.dto.response.ApiResponse;
import com.spendwise.dto.response.SavingsContributionResponse;
import com.spendwise.dto.response.SavingsGoalResponse;
import com.spendwise.service.SavingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@RequiredArgsConstructor
@Tag(name = "Savings Goals", description = "Endpoints for managing financial savings goals and contributions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SavingsController {

    private final SavingsService savingsService;

    @GetMapping
    @Operation(summary = "Get all savings goals for the authenticated user")
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getSavingsGoals() {
        List<SavingsGoalResponse> list = savingsService.getSavingsGoals();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single savings goal details")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getSavingsGoalById(@PathVariable Long id) {
        SavingsGoalResponse response = savingsService.getSavingsGoalById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> createSavingsGoal(@Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsService.createSavingsGoal(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing savings goal")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> updateSavingsGoal(
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request
    ) {
        SavingsGoalResponse response = savingsService.updateSavingsGoal(id, request);
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a savings goal")
    public ResponseEntity<ApiResponse<Void>> deleteSavingsGoal(@PathVariable Long id) {
        savingsService.deleteSavingsGoal(id);
        return ResponseEntity.ok(ApiResponse.success("Savings goal deleted successfully", null));
    }

    @PostMapping("/{id}/contributions")
    @Operation(summary = "Add a financial contribution towards a savings goal")
    public ResponseEntity<ApiResponse<SavingsContributionResponse>> addContribution(
            @PathVariable Long id,
            @Valid @RequestBody SavingsContributionRequest request
    ) {
        SavingsContributionResponse response = savingsService.addContribution(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contribution recorded successfully", response));
    }

    @GetMapping("/{id}/contributions")
    @Operation(summary = "Get contribution history for a savings goal")
    public ResponseEntity<ApiResponse<List<SavingsContributionResponse>>> getContributions(@PathVariable Long id) {
        List<SavingsContributionResponse> list = savingsService.getContributions(id);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
