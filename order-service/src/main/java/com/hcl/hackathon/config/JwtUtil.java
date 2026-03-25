package com.hcl.hackathon.config;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;

@Component
public class JwtUtil {

    private final Key key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Object userId = claims.get("userId");
        if (userId == null) return null;
        if (userId instanceof Number) return ((Number) userId).longValue();
        if (userId instanceof String) return Long.parseLong((String) userId);
        return null;
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        // Auth-service sends "role" (singular String); support "roles" (List) for flexibility
        List<?> rolesList = claims.get("roles", List.class);
        if (rolesList != null && !rolesList.isEmpty()) {
            return rolesList.stream()
                    .map(Object::toString)
                    .toList();
        }
        Object roleObj = claims.get("role");
        if (roleObj != null) {
            String role = roleObj.toString().trim();
            if (!role.isEmpty()) {
                return List.of(role);
            }
        }
        return List.of();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
