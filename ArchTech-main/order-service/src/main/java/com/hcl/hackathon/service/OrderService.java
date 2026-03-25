package com.hcl.hackathon.service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hcl.hackathon.config.JwtPrincipal;
import com.hcl.hackathon.client.MedicineClient;
import com.hcl.hackathon.dto.PlaceOrderRequest;
import com.hcl.hackathon.entity.Order;
import com.hcl.hackathon.entity.OrderItem;
import com.hcl.hackathon.entity.Status;
import com.hcl.hackathon.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MedicineClient medicineClient;

    public Order placeOrder(PlaceOrderRequest request) {

        Long userId = null;
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtPrincipal principal) {
            userId = principal.getUserId();
        }
        if (userId == null) {
            userId = request.getUserId();
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required (provide JWT or userId in request)");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        Order order = new Order();
        order.setUserId(userId);
        boolean needsApproval = Boolean.TRUE.equals(request.getRequiresPrescriptionApproval());
        order.setStatus(needsApproval ? Status.PENDING : Status.APPROVED);
        order.setCreatedAt(LocalDateTime.now());

        var items = request.getItems().stream().map(itemReq -> {
            Double price = medicineClient.getMedicinePrice(itemReq.getMedicineId());

            medicineClient.reduceStock(itemReq.getMedicineId(), itemReq.getQuantity());

            return OrderItem.builder()
                    .medicineId(itemReq.getMedicineId())
                    .quantity(itemReq.getQuantity())
                    .price(price)
                    .order(order)
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);

        Double total = items.stream()
                .map(i -> i.getPrice() * i.getQuantity())
                .reduce(0.0, Double::sum);

        order.setTotalAmount(total);

        return orderRepository.save(order);
    }
}