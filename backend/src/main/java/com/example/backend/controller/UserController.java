package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.FileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.FileUploadUtil;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @Autowired
    private HttpSession httpSession;

    @GetMapping("/admin")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/id/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/profileImage/{fileName}")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable String fileName) {
        byte[] imageContent = fileUploadUtil.getFileContent(fileName);
        if (imageContent == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageContent);
    }

    @PostMapping("/user/{username}/balance/add")
    public ResponseEntity<?> addBalance(@PathVariable String username, @RequestParam BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Amount must not be 0"));
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal currentBalance = user.getBalance() == null ? BigDecimal.ZERO : user.getBalance();
        BigDecimal updatedBalance = currentBalance.add(amount);

        if (updatedBalance.compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Insufficient balance"));
        }

        user.setBalance(updatedBalance);
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Balance updated successfully",
                "balance", updatedUser.getBalance()
        ));
    }

    @PostMapping("/user/{username}/salary")
    public ResponseEntity<?> setMonthlySalary(@PathVariable String username, @RequestParam BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Monthly salary must be greater than 0"));
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMonthlySalary(amount);
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Monthly salary updated successfully",
                "monthlySalary", updatedUser.getMonthlySalary()
        ));
    }

    @PostMapping("/user/{username}/salary/apply")
    public ResponseEntity<?> applyMonthlySalary(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal monthlySalary = user.getMonthlySalary() == null ? BigDecimal.ZERO : user.getMonthlySalary();

        if (monthlySalary.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Set monthly salary first"));
        }

        BigDecimal currentBalance = user.getBalance() == null ? BigDecimal.ZERO : user.getBalance();
        user.setBalance(currentBalance.add(monthlySalary));
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Monthly salary added to balance",
                "balance", updatedUser.getBalance(),
                "monthlySalary", updatedUser.getMonthlySalary()
        ));
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createUser(
            @Valid @RequestPart User user,
            @RequestPart("profileImage") MultipartFile profileImage,
            BindingResult bindingResult) throws IOException {
        log.warn(String.valueOf(user));

//        if (bindingResult.hasErrors()) {
//            List<String> validationErrors = bindingResult.getAllErrors().stream()
//                    .map(ObjectError::getDefaultMessage)
//                    .collect(Collectors.toList());
//            Map<String, Object> responseBody = new HashMap<>();
//            responseBody.put("message", "Validation failed");
//            responseBody.put("errors", validationErrors);
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
//        }

        if (bindingResult.hasErrors()) {
            // Construct error response with validation errors
            Map<String, String> validationErrors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                validationErrors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(validationErrors);
        }

        // Check if a user with the provided username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Username already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        // Proceed with user creation if username and email are unique
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getMonthlySalary() == null) {
            user.setMonthlySalary(BigDecimal.ZERO);
        }

        // Check if the user's role already contains "ADMIN"
        if (user.getRole() != null && user.getRole().contains("ADMIN")) {
            // If user has "ADMIN", append "USER" to the existing role
            user.setRole(user.getRole() + "USER");
        } else {
            // If user doesn't have "ADMIN", assign "USER" as the sole role
            user.setRole("USER");
        }

        // Handle profile image
        if (!profileImage.isEmpty()) {
            try {
                String fileName = fileUploadUtil.uploadFileAndSaveToDatabase(profileImage);
                user.setProfileImageFileName(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error occurred while processing profile image");
            }
        }

        // Save user to repository and return ResponseEntity
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestPart User userDetails,
            @RequestPart("profileImage") MultipartFile profileImage,
            BindingResult bindingResult) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (bindingResult.hasErrors()) {
            List<String> validationErrors = bindingResult.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage)
                    .collect(Collectors.toList());
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Validation failed");
            responseBody.put("errors", validationErrors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        // Check if the updated username or email already exists in the database
        if (!user.getUsername().equals(userDetails.getUsername()) && userRepository.existsByUsername(userDetails.getUsername())) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Username already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        if (!user.getEmail().equals(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
        }

        // Update user details
        user.setUsername(userDetails.getUsername());
        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole() != null ? userDetails.getRole() : user.getRole());
        user.setMonthlySalary(userDetails.getMonthlySalary() != null ? userDetails.getMonthlySalary() : user.getMonthlySalary());

        // Handle profile image
        if (!profileImage.isEmpty()) {
            try {
                String fileName = fileUploadUtil.uploadFileAndSaveToDatabase(profileImage);
                user.setProfileImageFileName(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error occurred while processing profile image");
            }
        } else {
            log.error("profile image is empty{}", profileImage);
        }

        // Save updated user to repository
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/admin/{id}")
    public void deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
