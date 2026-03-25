package com.hcl.hackathon.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hcl.hackathon.dto.AnalyticsResponse;
import com.hcl.hackathon.entity.Status;
import com.hcl.hackathon.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/management")
@RequiredArgsConstructor
public class ManagementController {

    private final OrderRepository orderRepository;

    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics() {

        return AnalyticsResponse.builder()
                .totalOrders(orderRepository.countTotalOrders())
                .totalRevenue(nullSafeDouble(orderRepository.totalRevenue()))
                .completedOrders(orderRepository.countByStatus(Status.APPROVED))
                .pendingOrders(orderRepository.countByStatus(Status.PENDING))
                .cancelledOrders(orderRepository.countByStatus(Status.CANCELLED))
                .todayRevenue(nullSafeDouble(orderRepository.todayRevenue(
                        LocalDateTime.now().toLocalDate().atStartOfDay())))
                .build();
    }

    private static Double nullSafeDouble(Double value) {
        return value != null ? value : 0.0;
    }
}
