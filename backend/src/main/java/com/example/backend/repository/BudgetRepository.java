package com.example.backend.repository;

import com.example.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    // Find all budgets for a specific user
    List<Budget> findByUsername(String username);
    
    // Find budget for a specific user, category, month, and year
    Optional<Budget> findByUsernameAndCategoryAndMonthAndYear(String username, String category, Integer month, Integer year);
    
    // Find all budgets for a user in a specific month/year
    List<Budget> findByUsernameAndMonthAndYear(String username, Integer month, Integer year);
    
    // Check if budget exists
    boolean existsByUsernameAndCategoryAndMonthAndYear(String username, String category, Integer month, Integer year);
}
