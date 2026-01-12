package com.example.backend.controller;

import com.example.backend.model.Budget;
import com.example.backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // GET all budgets for logged-in user
    @GetMapping
    public ResponseEntity<?> getAllBudgetsForUser(
            @RequestParam(required = false) String username) {
        
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required"));
        }

        log.info("Fetching all budgets for user: {}", username);
        List<Budget> budgets = budgetService.getBudgetsByUsername(username);
        return ResponseEntity.ok(budgets);
    }

    // GET budgets for current month
    @GetMapping("/current-month")
    public ResponseEntity<?> getBudgetsForCurrentMonth(
            @RequestParam(required = false) String username) {
        
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required"));
        }

        log.info("Fetching budgets for current month for user: {}", username);
        List<Budget> budgets = budgetService.getBudgetsByUsernameForCurrentMonth(username);
        return ResponseEntity.ok(budgets);
    }

    // GET specific budget by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long id) {
        log.info("Fetching budget with id: {}", id);
        
        var budget = budgetService.getBudgetById(id);
        if (budget.isPresent()) {
            return ResponseEntity.ok(budget.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET budget for specific category
    @GetMapping("/category/{username}/{category}")
    public ResponseEntity<?> getBudgetForCategory(
            @PathVariable String username,
            @PathVariable String category,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        
        log.info("Fetching budget for user: {}, category: {}, month: {}, year: {}", 
                 username, category, month, year);
        
        // Use current month/year if not provided
        if (month == null || year == null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = month != null ? month : now.getMonthValue();
            year = year != null ? year : now.getYear();
        }

        var budget = budgetService.getBudgetForCategory(username, category, month, year);
        if (budget.isPresent()) {
            return ResponseEntity.ok(budget.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST create new budget
    @PostMapping
    public ResponseEntity<?> createBudget(
            @Valid @RequestBody Budget budget,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            return handleValidationErrors(bindingResult);
        }

        log.info("Creating new budget for user: {}, category: {}", 
                 budget.getUsername(), budget.getCategory());

        try {
            Budget createdBudget = budgetService.createOrUpdateBudget(budget);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating budget: " + e.getMessage()));
        }
    }

    // PUT update existing budget
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody Budget budgetDetails,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            return handleValidationErrors(bindingResult);
        }

        log.info("Updating budget with id: {}", id);

        try {
            Budget updatedBudget = budgetService.updateBudget(id, budgetDetails);
            return ResponseEntity.ok(updatedBudget);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating budget", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating budget: " + e.getMessage()));
        }
    }

    // DELETE budget
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        log.info("Deleting budget with id: {}", id);
        
        boolean deleted = budgetService.deleteBudget(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET budget status (with alert info)
    @GetMapping("/{id}/status")
    public ResponseEntity<?> getBudgetStatus(@PathVariable Long id) {
        log.info("Fetching budget status for id: {}", id);
        
        try {
            BudgetService.BudgetStatus status = budgetService.getBudgetStatus(id);
            return ResponseEntity.ok(status);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST check if expense would exceed budget
    @PostMapping("/check-budget-limit")
    public ResponseEntity<?> checkBudgetLimit(
            @RequestParam String username,
            @RequestParam String category,
            @RequestParam BigDecimal expenseAmount,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        
        if (expenseAmount == null || expenseAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Expense amount must be greater than 0"));
        }

        // Use current month/year if not provided
        if (month == null || year == null) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = month != null ? month : now.getMonthValue();
            year = year != null ? year : now.getYear();
        }

        log.info("Checking budget limit for user: {}, category: {}, amount: {}", 
                 username, category, expenseAmount);

        boolean wouldExceed = budgetService.wouldExceedBudget(username, category, expenseAmount, month, year);
        
        return ResponseEntity.ok(Map.of(
            "wouldExceedBudget", wouldExceed,
            "message", wouldExceed ? 
                "This expense would exceed the budget for category " + category : 
                "Expense is within budget"
        ));
    }

    // Helper method to format validation errors
    private ResponseEntity<?> handleValidationErrors(BindingResult bindingResult) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Validation failed");
        List<String> validationErrors = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        responseBody.put("errors", validationErrors);
        return ResponseEntity.badRequest().body(responseBody);
    }
}
