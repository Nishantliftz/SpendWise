package com.spendwise.config;

import com.spendwise.entity.User;
import com.spendwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures demo users exist on startup with correctly hashed passwords.
 * Safe to run repeatedly – skips users that already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfNotExists("John Doe",   "john@example.com", "password123", "+1-555-0101");
        createUserIfNotExists("Jane Smith", "jane@example.com", "password123", "+1-555-0202");
    }

    private void createUserIfNotExists(String fullName, String email, String rawPassword, String phone) {
        if (userRepository.existsByEmail(email)) {
            log.info("Demo user already exists: {}", email);
            return;
        }
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .phone(phone)
                .currency("USD")
                .build();
        userRepository.save(user);
        log.info("Created demo user: {}", email);
    }
}
