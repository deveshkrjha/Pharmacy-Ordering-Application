package com.hcl.hackathon.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.hcl.hackathon.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
}