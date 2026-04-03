package com.example.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOrigin("http://localhost:9000"); // React frontend origin
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // Specify allowed methods
//        config.setAllowedHeaders(Arrays.asList("header1", "header2")); // Specify allowed headers
        config.addAllowedMethod("*"); // Allow all HTTP methods
        config.addAllowedHeader("*"); // Allow all headers

//        config.setExposedHeaders(List.of("authorization, content-type, xsrf-token"));
//        config.addAllowedHeader("authorization, content-type, xsrf-token"); // Allow headers
        config.setAllowCredentials(true); // Allow credentials (e.g., cookies)
//        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
