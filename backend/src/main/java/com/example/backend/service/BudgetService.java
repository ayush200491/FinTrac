package com.example.backend.service;

import com.example.backend.model.Budget;
import com.example.backend.model.Expense;
import com.example.backend.model.ExpenseCategory;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    // Create or update a budget
    public Budget createOrUpdateBudget(Budget budget) {
        log.info("Creating/updating budget for user: {}, category: {}", budget.getUsername(), budget.getCategory());
        
        // Validate budget
        if (budget.getLimitAmount() == null || budget.getLimitAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget limit must be greater than 0");
        }
        
        // Set current month/year if not provided
        if (budget.getMonth() == null || budget.getYear() == null) {
            LocalDate now = LocalDate.now();
            budget.setMonth(now.getMonthValue());
            budget.setYear(now.getYear());
        }
        
        return budgetRepository.save(budget);
    }

    // Get budget by ID with calculated metrics
    public Optional<Budget> getBudgetById(Long id) {
        Optional<Budget> budget = budgetRepository.findById(id);
        if (budget.isPresent()) {
            enrichBudgetWithMetrics(budget.get());
        }
        return budget;
    }

    // Get all budgets for a user with calculated metrics
    public List<Budget> getBudgetsByUsername(String username) {
        List<Budget> budgets = budgetRepository.findByUsername(username);
        budgets.forEach(this::enrichBudgetWithMetrics);
        return budgets;
    }

    // Get budgets for a user in current month
    public List<Budget> getBudgetsByUsernameForCurrentMonth(String username) {
        LocalDate now = LocalDate.now();
        List<Budget> budgets = budgetRepository.findByUsernameAndMonthAndYear(
            username, 
            now.getMonthValue(), 
            now.getYear()
        );
        budgets.forEach(this::enrichBudgetWithMetrics);
        return budgets;
    }

    // Get specific budget
    public Optional<Budget> getBudgetForCategory(String username, String category, Integer month, Integer year) {
        Optional<Budget> budget = budgetRepository.findByUsernameAndCategoryAndMonthAndYear(username, category, month, year);
        if (budget.isPresent()) {
            enrichBudgetWithMetrics(budget.get());
        }
        return budget;
    }

    // Update budget
    public Budget updateBudget(Long id, Budget budgetDetails) {
        Optional<Budget> optionalBudget = budgetRepository.findById(id);
        if (optionalBudget.isPresent()) {
            Budget budget = optionalBudget.get();
            
            if (budgetDetails.getLimitAmount() != null) {
                budget.setLimitAmount(budgetDetails.getLimitAmount());
            }
            if (budgetDetails.getAlertThreshold() != null) {
                budget.setAlertThreshold(budgetDetails.getAlertThreshold());
            }
            
            return budgetRepository.save(budget);
        }
        throw new RuntimeException("Budget not found with id: " + id);
    }

    // Delete budget
    public boolean deleteBudget(Long id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Calculate total spent for a category in a given month/year
    public BigDecimal calculateSpentForCategory(String username, String categoryName, Integer month, Integer year) {
        List<Expense> expenses = expenseRepository.findByUsername(username);

        ExpenseCategory category = ExpenseCategory.fromString(categoryName);
        return expenses.stream()
            .filter(expense -> expense.getCategory() == category)
            .filter(expense -> expense.getDate() != null)
            .filter(expense -> expense.getDate().getMonthValue() == month && expense.getDate().getYear() == year)
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Check if adding an expense would exceed budget
    public boolean wouldExceedBudget(String username, String category, BigDecimal expenseAmount, Integer month, Integer year) {
        Optional<Budget> budgetOpt = budgetRepository.findByUsernameAndCategoryAndMonthAndYear(username, category, month, year);
        
        if (budgetOpt.isEmpty()) {
            return false; // No budget set for this category
        }
        
        Budget budget = budgetOpt.get();
        BigDecimal spent = calculateSpentForCategory(username, category, month, year);
        BigDecimal newTotal = spent.add(expenseAmount);
        
        return newTotal.compareTo(budget.getLimitAmount()) > 0;
    }

    // Get budget alert status
    public BudgetStatus getBudgetStatus(Long budgetId) {
        Optional<Budget> budgetOpt = getBudgetById(budgetId);
        
        if (budgetOpt.isEmpty()) {
            throw new RuntimeException("Budget not found");
        }
        
        Budget budget = budgetOpt.get();
        BudgetStatus status = new BudgetStatus();
        status.setBudgetId(budgetId);
        status.setSpent(budget.getCurrentSpent());
        status.setLimit(budget.getLimitAmount());
        status.setRemaining(budget.getRemaining());
        status.setPercentageUsed(budget.getPercentageUsed());
        status.setAlertTriggered(budget.isAlertTriggered());
        status.setLimitExceeded(budget.isLimitExceeded());
        status.setAlertThreshold(budget.getAlertThreshold());
        
        return status;
    }

    // Enrich budget with calculated metrics
    private void enrichBudgetWithMetrics(Budget budget) {
        BigDecimal spent = calculateSpentForCategory(budget.getUsername(), budget.getCategory(), budget.getMonth(), budget.getYear());
        budget.calculateMetrics(spent);
    }

    // Inner class for budget status response
    public static class BudgetStatus {
        private Long budgetId;
        private BigDecimal spent;
        private BigDecimal limit;
        private BigDecimal remaining;
        private Double percentageUsed;
        private Boolean alertTriggered;
        private Boolean limitExceeded;
        private Double alertThreshold;

        // Getters and Setters
        public Long getBudgetId() { return budgetId; }
        public void setBudgetId(Long budgetId) { this.budgetId = budgetId; }

        public BigDecimal getSpent() { return spent; }
        public void setSpent(BigDecimal spent) { this.spent = spent; }

        public BigDecimal getLimit() { return limit; }
        public void setLimit(BigDecimal limit) { this.limit = limit; }

        public BigDecimal getRemaining() { return remaining; }
        public void setRemaining(BigDecimal remaining) { this.remaining = remaining; }

        public Double getPercentageUsed() { return percentageUsed; }
        public void setPercentageUsed(Double percentageUsed) { this.percentageUsed = percentageUsed; }

        public Boolean getAlertTriggered() { return alertTriggered; }
        public void setAlertTriggered(Boolean alertTriggered) { this.alertTriggered = alertTriggered; }

        public Boolean getLimitExceeded() { return limitExceeded; }
        public void setLimitExceeded(Boolean limitExceeded) { this.limitExceeded = limitExceeded; }

        public Double getAlertThreshold() { return alertThreshold; }
        public void setAlertThreshold(Double alertThreshold) { this.alertThreshold = alertThreshold; }
    }
}
