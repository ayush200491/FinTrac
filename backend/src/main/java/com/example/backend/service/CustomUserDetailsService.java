package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
//                user.isEnabled(),   // Explicitly setting enabled status
//                true,               // Explicitly setting accountNonExpired
//                true,               // Explicitly setting credentialsNonExpired
//                true,               // Explicitly setting accountNonLocked
                mapRolesToAuthorities(List.of(user.getRole()))
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(List<String> roles) {
        return roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    public List<String> generateUsernameSuggestions(String username) {
        List<String> suggestions = new ArrayList<>();
        Random random = new Random();

        // Generate and add 3 random suggestions
        for (int i = 0; i < 3; i++) {
            // Generate a random number between 100 and 9999
            int randomNumber = random.nextInt(9000) + 100;
            // Append the random number to the username
            String suggestion = username + randomNumber;
            // Check if the suggestion already exists in the database
            if (!userRepository.existsByUsername(suggestion)) {
                suggestions.add(suggestion);
            }
        }
        return suggestions;
    }

}
