package com.hcl.hackathon.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.hackathon.entity.Prescription;
import com.hcl.hackathon.entity.Status;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Get prescription by order ID
    Optional<Prescription> findByOrderId(Long orderId);

    // Get prescriptions by status (PENDING, APPROVED, REJECTED)
    List<Prescription> findByStatus(Status status);
}