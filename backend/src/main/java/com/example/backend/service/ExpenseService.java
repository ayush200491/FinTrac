package com.example.backend.service;

import com.example.backend.model.Expense;
import com.example.backend.model.ExpenseCategory;
import com.example.backend.repository.ExpenseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Validated
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional
    public Expense createExpense(@Valid Expense expense) {
        if (expense.getCategory() == null) {
            expense.setCategory(ExpenseCategory.OTHER);
        }
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        return expenseRepository.save(expense);
    }

    @Transactional(readOnly = true)
    public List<Expense> getAllExpenses(String username) {
        return expenseRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(Long id) {
        Optional<Expense> expenseOptional = expenseRepository.findById(id);
        return expenseOptional.orElse(null);
    }

    @Transactional
    public Expense updateExpense(Long id, @Valid Expense expenseDetails) {
        if (expenseRepository.existsById(id)) {
            expenseDetails.setExpense_id(id);
            return expenseRepository.save(expenseDetails);
        }
        return null;
    }

    @Transactional
    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Category-based methods

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByCategory(String username, ExpenseCategory category) {
        return getAllExpenses(username).stream()
            .filter(expense -> expense.getCategory() == category)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByDateRange(String username, LocalDate startDate, LocalDate endDate) {
        return getAllExpenses(username).stream()
            .filter(expense -> expense.getDate() != null &&
                    !expense.getDate().isBefore(startDate) &&
                    !expense.getDate().isAfter(endDate))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpensesByCategoryAndDateRange(String username, ExpenseCategory category, LocalDate startDate, LocalDate endDate) {
        return getAllExpenses(username).stream()
            .filter(expense -> expense.getCategory() == category &&
                    expense.getDate() != null &&
                    !expense.getDate().isBefore(startDate) &&
                    !expense.getDate().isAfter(endDate))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<ExpenseCategory, List<Expense>> getExpensesGroupedByCategory(String username) {
        return getAllExpenses(username).stream()
            .collect(Collectors.groupingBy(Expense::getCategory));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getExpenseSummaryByCategory(String username) {
        Map<String, Object> summary = new HashMap<>();
        List<Expense> allExpenses = getAllExpenses(username);

        for (ExpenseCategory category : ExpenseCategory.values()) {
            Map<String, Object> categoryData = new HashMap<>();
            List<Expense> categoryExpenses = allExpenses.stream()
                .filter(e -> e.getCategory() == category)
                .collect(Collectors.toList());

            categoryData.put("count", categoryExpenses.size());
            categoryData.put("total", categoryExpenses.stream()
                .map(Expense::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));
            categoryData.put("expenses", categoryExpenses);

            summary.put(category.name(), categoryData);
        }

        return summary;
    }

    @Transactional(readOnly = true)
    public List<ExpenseCategory> getAllCategories() {
        return Arrays.asList(ExpenseCategory.values());
    }
}
