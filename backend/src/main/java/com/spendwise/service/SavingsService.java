package com.spendwise.service;

import com.spendwise.dto.request.SavingsContributionRequest;
import com.spendwise.dto.request.SavingsGoalRequest;
import com.spendwise.dto.response.SavingsContributionResponse;
import com.spendwise.dto.response.SavingsGoalResponse;
import com.spendwise.entity.SavingsContribution;
import com.spendwise.entity.SavingsGoal;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.exception.UnauthorizedException;
import com.spendwise.repository.SavingsContributionRepository;
import com.spendwise.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingsService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsContributionRepository contributionRepository;
    private final AuthService authService;

    public List<SavingsGoalResponse> getSavingsGoals() {
        User user = authService.getCurrentUser();
        List<SavingsGoal> goals = savingsGoalRepository.findByUserId(user.getId());
        return goals.stream().map(this::mapToGoalResponse).collect(Collectors.toList());
    }

    public SavingsGoalResponse getSavingsGoalById(Long id) {
        User user = authService.getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));

        if (!goal.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this goal");
        }

        return mapToGoalResponse(goal);
    }

    @Transactional
    public SavingsGoalResponse createSavingsGoal(SavingsGoalRequest request) {
        User user = authService.getCurrentUser();

        SavingsGoal goal = SavingsGoal.builder()
                .userId(user.getId())
                .goalName(request.getGoalName())
                .targetAmount(request.getTargetAmount())
                .currentAmount(BigDecimal.ZERO)
                .targetDate(request.getTargetDate())
                .description(request.getDescription())
                .build();

        SavingsGoal saved = savingsGoalRepository.save(goal);
        return mapToGoalResponse(saved);
    }

    @Transactional
    public SavingsGoalResponse updateSavingsGoal(Long id, SavingsGoalRequest request) {
        User user = authService.getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));

        if (!goal.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this goal");
        }

        goal.setGoalName(request.getGoalName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());
        goal.setDescription(request.getDescription());

        SavingsGoal updated = savingsGoalRepository.save(goal);
        return mapToGoalResponse(updated);
    }

    @Transactional
    public void deleteSavingsGoal(Long id) {
        User user = authService.getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + id));

        if (!goal.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this goal");
        }

        savingsGoalRepository.delete(goal);
    }

    @Transactional
    public SavingsContributionResponse addContribution(Long goalId, SavingsContributionRequest request) {
        User user = authService.getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + goalId));

        if (!goal.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to contribute to this goal");
        }

        SavingsContribution contribution = SavingsContribution.builder()
                .goalId(goalId)
                .amount(request.getAmount())
                .contributionDate(request.getContributionDate())
                .description(request.getDescription())
                .build();

        SavingsContribution savedContrib = contributionRepository.save(contribution);

        // Update current amount on goal
        BigDecimal newCurrent = goal.getCurrentAmount() != null ?
                goal.getCurrentAmount().add(request.getAmount()) : request.getAmount();
        goal.setCurrentAmount(newCurrent);
        savingsGoalRepository.save(goal);

        return SavingsContributionResponse.builder()
                .id(savedContrib.getId())
                .goalId(savedContrib.getGoalId())
                .amount(savedContrib.getAmount())
                .contributionDate(savedContrib.getContributionDate())
                .description(savedContrib.getDescription())
                .createdAt(savedContrib.getCreatedAt())
                .build();
    }

    public List<SavingsContributionResponse> getContributions(Long goalId) {
        User user = authService.getCurrentUser();
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found with id: " + goalId));

        if (!goal.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view contributions for this goal");
        }

        return contributionRepository.findByGoalIdOrderByContributionDateDesc(goalId).stream()
                .map(c -> SavingsContributionResponse.builder()
                        .id(c.getId())
                        .goalId(c.getGoalId())
                        .amount(c.getAmount())
                        .contributionDate(c.getContributionDate())
                        .description(c.getDescription())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private SavingsGoalResponse mapToGoalResponse(SavingsGoal goal) {
        double progress = 0.0;
        BigDecimal current = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;
        if (goal.getTargetAmount() != null && goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progress = current.divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return SavingsGoalResponse.builder()
                .id(goal.getId())
                .userId(goal.getUserId())
                .goalName(goal.getGoalName())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(current)
                .targetDate(goal.getTargetDate())
                .description(goal.getDescription())
                .progressPercentage(progress)
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .build();
    }
}
