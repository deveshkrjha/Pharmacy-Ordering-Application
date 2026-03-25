package com.hcl.hackathon.dto;

import lombok.*;
import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
    /** If true, order is created as PENDING (prescription required). If false/null, order is APPROVED. */
    private Boolean requiresPrescriptionApproval;
}
