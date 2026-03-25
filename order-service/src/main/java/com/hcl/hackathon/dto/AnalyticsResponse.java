package com.hcl.hackathon.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsResponse {
    private Long totalOrders;
    private Double totalRevenue;
    private Long completedOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
    private Double todayRevenue;
}
