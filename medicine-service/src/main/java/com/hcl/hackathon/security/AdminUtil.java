package com.hcl.hackathon.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

public class AdminUtil {

    public static void checkAdmin() {

        UsernamePasswordAuthenticationToken auth =
                (UsernamePasswordAuthenticationToken)
                        SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getDetails() == null || !(auth.getDetails() instanceof AuthDetails)) {
            throw new RuntimeException("Unauthorized");
        }

        String role = ((AuthDetails) auth.getDetails()).getRole();

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Only ADMIN allowed");
        }
    }
}