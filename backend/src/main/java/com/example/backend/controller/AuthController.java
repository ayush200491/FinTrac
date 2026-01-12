package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.FileMetadata;
import com.example.backend.model.User;
import com.example.backend.repository.FileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.CustomUserDetailsService;
import com.example.backend.util.FileUploadUtil;
import jakarta.validation.Valid;
import jdk.jshell.spi.ExecutionControl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.AuthenticationException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//@RequestMapping("/api")
@Slf4j
@RestController
public class AuthController {

//    @Autowired
//    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @Autowired
    private FileRepository fileRepository; // Autowire FileRepository


//    public AuthController(AuthenticationManager authenticationManager) {
//        this.authenticationManager = authenticationManager;
//    }

    //    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
//                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Log authentication details
//            if (authentication.isAuthenticated()) {
//                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//                log.info("User '{}' successfully authenticated. Authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());
//            }
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("User '{}' successfully authenticated. Authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());
            return ResponseEntity.ok(new AuthResponse(userDetails.getUsername(), userDetails.getAuthorities().iterator().next().getAuthority(), "Login successful!"));
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for username: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        String username = userDetails.getUsername();
//        String role = userDetails.getAuthorities().iterator().next().getAuthority();
//
//        return ResponseEntity.ok(new AuthResponse(username, role));
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(
//            @Valid @RequestBody User user,
//            @RequestPart(value = "profileImage") MultipartFile profileImage,
////            @RequestParam("profileImage") MultipartFile profileImage,
//            BindingResult bindingResult) throws IOException {
//
//        // Check for validation errors
//        if (bindingResult.hasErrors()) {
//            List<String> validationErrors = bindingResult.getAllErrors().stream()
//                    .map(ObjectError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "Validation failed", "errors", validationErrors));
//        }
//
//        // Check if the username already exists
//        if (userRepository.existsByUsername(user.getUsername())) {
//            List<String> suggestedUsernames = customUserDetailsService.generateUsernameSuggestions(user.getUsername());
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("message", "Username already exists", "suggestedUsernames", suggestedUsernames));
//        }
//
//        // Creating user's account
////        User user = new User();
////        user.setUsername(signUpRequest.getUsername());
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
////        user.setEmail(signUpRequest.getEmail());
//        user.setRole("ROLE_USER");
//
//        // Process profile image
//        if (!profileImage.isEmpty()) {
//            try {
//                user.setProfileImage(profileImage.getBytes());
//            } catch (IOException e) {
//                log.error("Error occurred while processing profile image", e);
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body(Map.of("message", "Error occurred while processing profile image"));
//            }
//        }
//
//        // Save user to repository
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
//    }


//    @PostMapping(value="/register", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> registerUser(
//            @ModelAttribute User user,
//            @RequestPart("profileImage") MultipartFile profileImage,
//            BindingResult bindingResult) throws IOException {
//
//        // Check for validation errors
//        if (bindingResult.hasErrors()) {
//            List<String> validationErrors = bindingResult.getAllErrors().stream()
//                    .map(ObjectError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "Validation failed", "errors", validationErrors));
//        }
//
//        // Check if the username already exists
//        if (userRepository.existsByUsername(user.getUsername())) {
//            List<String> suggestedUsernames = customUserDetailsService.generateUsernameSuggestions(user.getUsername());
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("message", "Username already exists", "suggestedUsernames", suggestedUsernames));
//        }
//
//        // Creating user's account
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRole("ROLE_USER");
//
//        // Process profile image
//        if (!profileImage.isEmpty()) {
//            try {
//                // Convert byte[] to Base64-encoded string
//                String base64Image = Base64.getEncoder().encodeToString(profileImage.getBytes());
//                // Set profile image for the user
//                user.setProfileImage(base64Image.getBytes());
//            } catch (IOException e) {
//                log.error("Error occurred while processing profile image", e);
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body(Map.of("message", "Error occurred while processing profile image"));
//            }
//        }
//
//        // Save user to repository
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
//    }
//
//    @PostMapping(name="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> registerUser(
//            @Valid @RequestBody User user,
//            @RequestParam("profileImage") MultipartFile profileImage,
//            BindingResult bindingResult) throws IOException {
//        log.info("Received user data: {}", user);
//        log.info("Received profile image: {}", profileImage.getOriginalFilename());
//
//        // Check for validation errors
//        if (bindingResult.hasErrors()) {
//            List<String> validationErrors = bindingResult.getAllErrors().stream()
//                    .map(ObjectError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "Validation failed", "errors", validationErrors));
//        }
//
//        try {
//            // Upload and save profile image
//            String fileName = fileUploadUtil.uploadFileAndSaveToDatabase(profileImage);
//            user.setProfileImage(fileName.getBytes()); // Assuming profileImage is a byte array field in User entity
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("message", "Failed to upload profile image"));
//        }
//
//        // Check if the username already exists
//        if (userRepository.existsByUsername(user.getUsername())) {
//            List<String> suggestedUsernames = customUserDetailsService.generateUsernameSuggestions(user.getUsername());
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("message", "Username already exists", "suggestedUsernames", suggestedUsernames));
//        }
//
//        // Creating user's account
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRole("ROLE_USER");
//
//        // Save user to repository
//        userRepository.save(user);
//
//        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
//    }
@PostMapping(path = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> registerUser(
        @Valid @RequestPart("user") User user,
    @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
        BindingResult bindingResult) throws IOException {

    log.info("Received user data: {}", user);
    if (profileImage != null) {
        log.info("Received profile image: {}", profileImage.getOriginalFilename());
    }

    // Check for validation errors
    if (bindingResult.hasErrors()) {
        List<String> validationErrors = bindingResult.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Validation failed", "errors", validationErrors));
    }

    if (profileImage != null && !profileImage.isEmpty()) {
        try {
            String fileName = fileUploadUtil.uploadFileAndSaveToDatabase(profileImage);
            user.setProfileImageFileName(fileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload profile image"));
        }
    }

    // Check if the username already exists & provide suggestions
    if (userRepository.existsByUsername(user.getUsername())) {
        List<String> suggestedUsernames = customUserDetailsService.generateUsernameSuggestions(user.getUsername());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Username already exists", "suggestedUsernames", suggestedUsernames));
    }

    // Creating user's account
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole("ROLE_USER");

    // Save user to repository
    userRepository.save(user);

    return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
}
//    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> registerUser(
//            @Valid @RequestBody User user,
//            @RequestBody RegisterRequest request,
//            @RequestParam("profileImage") MultipartFile profileImage,
//            BindingResult bindingResult) throws IOException {
//        log.info("Received data: {}", request);
//        log.info("Profile image name: {}", profileImage.getOriginalFilename());
//
//        // Check for validation errors
//        if (bindingResult.hasErrors()) {
//            List<String> validationErrors = bindingResult.getAllErrors().stream()
//                    .map(ObjectError::getDefaultMessage)
//                    .toList();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "Validation failed", "errors", validationErrors));
//        }
//
//        // Convert multipart file to byte array
//        byte[] profileImageData = profileImage.getBytes();
//        user.setProfileImage(profileImageData);
//
//        // Check password length
//        if (user.getPassword().length() < 6) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("message", "Password must be at least 6 characters"));
//        }
//
//        // Check if the username already exists
//        if (userRepository.existsByUsername(user.getUsername())) {
//            List<String> suggestedUsernames = customUserDetailsService.generateUsernameSuggestions(user.getUsername());
//            return ResponseEntity.status(HttpStatus.CONFLICT)
//                    .body(Map.of("message", "Username already exists", "suggestedUsernames", suggestedUsernames));
//        }
//
//        // Creating user's account
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRole("ROLE_USER");
//
//        // Save user to repository
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
//    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Implement logout logic here
        return ResponseEntity.ok("Logged out successfully!");
    }
}
