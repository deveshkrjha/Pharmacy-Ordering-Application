package com.hcl.hackathon.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long medicineId;
    private Integer quantity;
}