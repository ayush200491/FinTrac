package com.example.backend.repository;

import com.example.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	List<Expense> findByUsername(String username);

}
