package com.hcl.hackathon.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, String>> handleMedicineServiceUnavailable(ResourceAccessException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "Medicine service unavailable. Ensure it is running on port 8082.", "detail", e.getMessage()));
    }

    @ExceptionHandler({ HttpClientErrorException.class, HttpServerErrorException.class })
    public ResponseEntity<Map<String, String>> handleHttpClientErrors(Exception e) {
        if (e instanceof HttpClientErrorException ex && ex.getStatusCode().value() == 404) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "One or more medicines not found. Check medicine IDs."));
        }
        String message = e.getMessage();
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "Medicine service error.", "detail", message != null ? message : ""));
    }
}
