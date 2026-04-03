package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Table(name = "users")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is mandatory")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

//    @NotBlank(message="Mobile number must not be blank")
//    @Pattern(regexp="(^$|[0-9]{10})",message = "Mobile number must be 10 digits")
//    private String mobileNum;


    private String role;

//    @Lob
//    @Column(columnDefinition = "BLOB", length = 1048576) // Specify the length in bytes
//    private byte[] profileImage;

    private String profileImageFileName; // Store the filename instead of content

    private BigDecimal balance = BigDecimal.ZERO; // Default initial balance is 0

    private BigDecimal monthlySalary = BigDecimal.ZERO;

//    @Column(nullable = false)
//    private boolean enabled;

    // One-to-Many mapping with Expense
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Expense> expenses = new ArrayList<>();
}