package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "budgets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"username", "category", "month", "year"})
})
public class Budget extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budget_id;

    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username must be up to 50 characters")
    private String username;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must be up to 50 characters")
    private String category;

    @NotNull(message = "Budget limit is required")
    @Positive(message = "Budget limit must be positive")
    private BigDecimal limitAmount;

    @NotNull(message = "Month is required")
    @Min(1)
    @Max(12)
    private Integer month;

    @NotNull(message = "Year is required")
    @PositiveOrZero(message = "Year cannot be negative")
    private Integer year;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double alertThreshold = 80.0; // Alert when spending reaches 80% of budget

    // Calculated field - not persisted
    @Transient
    private BigDecimal currentSpent = BigDecimal.ZERO;

    // Calculated field - not persisted
    @Transient
    private BigDecimal remaining;

    // Calculated field - not persisted
    @Transient
    private Double percentageUsed;

    // Helper methods
    public void calculateMetrics(BigDecimal spent) {
        this.currentSpent = spent != null ? spent : BigDecimal.ZERO;
        this.remaining = this.limitAmount.subtract(this.currentSpent);
        this.percentageUsed = this.limitAmount.compareTo(BigDecimal.ZERO) > 0
            ? (this.currentSpent.doubleValue() / this.limitAmount.doubleValue()) * 100
            : 0.0;
    }

    public boolean isAlertTriggered() {
        if (percentageUsed == null) {
            return false;
        }
        return percentageUsed >= (alertThreshold != null ? alertThreshold : 80.0);
    }

    public boolean isLimitExceeded() {
        return this.remaining != null && this.remaining.compareTo(BigDecimal.ZERO) < 0;
    }
}
