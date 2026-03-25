package com.hcl.hackathon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.hackathon.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}