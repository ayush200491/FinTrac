package com.example.backend.security;

import com.example.backend.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
//    @Autowired
//    private CorsConfigurationSource corsConfigurationSource;

//    @Autowired
//    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CorsConfig corsConfig) throws Exception {
        http
//                .httpBasic(withDefaults())
                .cors(withDefaults())
//                .cors(Customizer.withDefaults()) // Apply the CORS configuration
//                .cors(AbstractHttpConfigurer::disable) // Disable default CORS to use custom filter
//                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom configuration
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF if not needed
//                .csrf((csrf) -> csrf
//                        .csrfTokenRepository(new HttpSessionCsrfTokenRepository())
//                )
//                .csrf((csrf) -> csrf
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                )
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
//                                .requestMatchers("/**").permitAll()    // Adjust the permit rules as needed
                        .requestMatchers("/", "/health").permitAll()
                                .requestMatchers("/csrf-token").permitAll()
                                .requestMatchers("/login", "/register", "/h2-console/**", "/users/**","/static/**", "/public/**").permitAll()
                                .requestMatchers("/expenses/**").permitAll()
                                .requestMatchers("/budgets/**").permitAll()
//                                .requestMatchers("/admin/**").permitAll()
                                .requestMatchers("/admin/**").hasAuthority("ADMIN")
//                                .requestMatchers("/users/user/**").hasAuthority("ROLE_USER", "ADMIN", "*")
                                .anyRequest().authenticated()
                )
//                .formLogin(formLogin ->
//                        formLogin
////                                .loginPage("/login")
////                                .loginProcessingUrl("/perform_login") // Custom login processing URL
//                                .defaultSuccessUrl("/home", true)
//                                .failureUrl("/login?error=true")
//                                .permitAll()
//                )
//                .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
                .headers(headers ->
                        headers
                                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin) // Allow framing from same origin (useful for H2 console)
                )
//                .logout(logout ->
//                                logout
////                                .logoutUrl("/logout")
//                                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                                        .logoutSuccessUrl("/login")
//                                        .permitAll()
//                )
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .accessDeniedPage("/access-denied")
                );

        return http.build();
    }

//    @Bean
//    public LoginUrlAuthenticationEntryPoint loginUrlAuthenticationEntryPoint() {
//        return new LoginUrlAuthenticationEntryPoint("/"); // Redirect unauthorized requests to /
//    }

//    @Bean
//    public UserDetailsService userDetailsService() {
//        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
//        manager.createUser(User.withUsername("user")
//                .password(passwordEncoder().encode("password"))
//                .roles("USER")
//                .build());
//        manager.createUser(User.withUsername("admin")
//                .password(passwordEncoder().encode("admin123"))
//                .roles("ADMIN")
//                .build()
//        );
//        return manager;
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //    @Bean
//    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
//        AuthenticationManagerBuilder authenticationManagerBuilder =
//                http.getSharedObject(AuthenticationManagerBuilder.class);
//        authenticationManagerBuilder
//                .userDetailsService(customUserDetailsService)
//                .passwordEncoder(passwordEncoder());
//        return authenticationManagerBuilder.build();
//    }

//    @Bean
//    public AuthenticationManager authenticationManager(CustomUserDetailsService customUserDetailsService) {
//        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
//        authenticationProvider.setUserDetailsService(customUserDetailsService);
//        authenticationProvider.setPasswordEncoder(passwordEncoder());
//
//        return new ProviderManager(authenticationProvider);
//    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth, UserDetailsService userDetailsService) throws Exception {
//        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
//    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
//    }

    // CORS Configuration
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.addAllowedOriginPattern("*"); // Allow the React frontend
//        configuration.addAllowedOrigin("http://localhost:9000/");
//        configuration.addAllowedMethod("*"); // Allow all HTTP methods
//        configuration.addAllowedHeader("*"); // Allow all headers
//        configuration.setAllowCredentials(true); // Allow credentials (e.g., cookies)
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
}

