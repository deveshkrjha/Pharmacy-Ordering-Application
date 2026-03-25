package com.pharmacy.auth.config;

import com.pharmacy.auth.entity.Role;
import com.pharmacy.auth.entity.User;
import com.pharmacy.auth.repository.RoleRepository;
import com.pharmacy.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (roleRepository.findByRoleName("USER").isEmpty()) {
            roleRepository.save(Role.builder().roleName("USER").build());
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().roleName("ADMIN").build()));

        Role managerRole = roleRepository.findByRoleName("MANAGER").orElseGet(() ->
                roleRepository.save(Role.builder().roleName("MANAGER").build()));

        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@gmail.com");
        }

        if (userRepository.findByEmail("manager@gmail.com").isEmpty()) {
            User manager = User.builder()
                    .name("Manager")
                    .email("manager@gmail.com")
                    .password(passwordEncoder.encode("manager123"))
                    .role(managerRole)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(manager);
            System.out.println("Default manager user created: manager@gmail.com");
        }

        System.out.println("Default roles and admin data initialized.");
    }
}