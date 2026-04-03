package com.example.backend.model;

import com.example.backend.model.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "expenses")
public class Expense extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expense_id;

    @NotNull
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @Column(length = 50)
    private String username;

    @NotNull(message = "Category is required")
    @Convert(converter = ExpenseCategoryConverter.class)
    @Column(length = 50)
    private ExpenseCategory category;

    @Size(max = 255, message = "Description must be up to 255 characters")
    private String description;

//    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate date;

    @NotBlank(message = "Expense type is required")
    @Size(max = 20, message = "Expense type must be up to 20 characters")
    private String expenseType;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "id", nullable = false)
//    private User user;

    @PrePersist
    public void setDefaults() {
        if (this.category == null) {
            this.category = ExpenseCategory.OTHER;
        }
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
}
