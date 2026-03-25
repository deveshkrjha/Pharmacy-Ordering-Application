package com.hcl.hackathon.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JwtPrincipal {
    private final String email;
    private final Long userId;
}
