package com.hcl.hackathon.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.hackathon.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder_Id(Long orderId);

    List<OrderItem> findByMedicineId(Long medicineId);
}