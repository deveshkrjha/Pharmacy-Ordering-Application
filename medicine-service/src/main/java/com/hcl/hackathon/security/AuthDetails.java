package com.hcl.hackathon.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthDetails {
    private String role;
    private Long userId;
}
