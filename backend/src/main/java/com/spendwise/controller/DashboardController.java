package com.spendwise.controller;

import com.spendwise.dto.response.ApiResponse;
import com.spendwise.dto.response.CategoryBreakdownResponse;
import com.spendwise.dto.response.DashboardSummaryResponse;
import com.spendwise.dto.response.MonthlyTrendResponse;
import com.spendwise.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for dashboard metrics, summary, trends and breakdowns")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get complete dashboard financial summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        DashboardSummaryResponse response = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/monthly-trends")
    @Operation(summary = "Get 6-month historical income, expense and savings trends")
    public ResponseEntity<ApiResponse<List<MonthlyTrendResponse>>> getMonthlyTrends() {
        List<MonthlyTrendResponse> response = dashboardService.getMonthlyTrends();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/category-breakdown")
    @Operation(summary = "Get expense category percentage breakdown for the current month")
    public ResponseEntity<ApiResponse<List<CategoryBreakdownResponse>>> getCategoryBreakdown() {
        List<CategoryBreakdownResponse> response = dashboardService.getCategoryBreakdown();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
