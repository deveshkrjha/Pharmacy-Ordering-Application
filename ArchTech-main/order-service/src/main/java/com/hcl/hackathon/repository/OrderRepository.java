package com.hcl.hackathon.repository;

import org.springframework.data.jpa.repository.*;

import com.hcl.hackathon.entity.Order;
import com.hcl.hackathon.entity.Status;

import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = com.hcl.hackathon.entity.Status.APPROVED")
    Double totalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status=:status")
    Long countByStatus(Status status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :start AND o.status = com.hcl.hackathon.entity.Status.APPROVED")
    Double todayRevenue(LocalDateTime start);
}