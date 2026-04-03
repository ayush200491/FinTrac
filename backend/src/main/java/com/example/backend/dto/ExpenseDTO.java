package com.example.backend.dto;

import com.example.backend.model.ExpenseCategory;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Long expense_id;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @Size(max = 255, message = "Description must be up to 255 characters")
    private String description;

    private LocalDate date;

    @NotBlank(message = "Expense type is required")
    @Size(max = 20, message = "Expense type must be up to 20 characters")
    private String expenseType;

    private LocalDate createdAt;
    private String createdBy;
    private LocalDate updatedAt;

    /**
     * Create DTO from Entity
     */
    public static ExpenseDTO fromEntity(com.example.backend.model.Expense expense) {
        if (expense == null) {
            return null;
        }

        ExpenseDTO dto = new ExpenseDTO();
        dto.setExpense_id(expense.getExpense_id());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setExpenseType(expense.getExpenseType());
        return dto;
    }

    /**
     * Convert DTO to Entity
     */
    public com.example.backend.model.Expense toEntity() {
        com.example.backend.model.Expense expense = new com.example.backend.model.Expense();
        expense.setExpense_id(this.expense_id);
        expense.setAmount(this.amount);
        expense.setCategory(this.category != null ? this.category : ExpenseCategory.OTHER);
        expense.setDescription(this.description);
        expense.setDate(this.date != null ? this.date : LocalDate.now());
        expense.setExpenseType(this.expenseType);
        return expense;
    }
}
