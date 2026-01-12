package com.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
//    private String usernameOrEmail;
//    private String email;
    private String username;
    private String password;
}
