package com.hcl.hackathon.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hcl.hackathon.entity.Medicine;
import com.hcl.hackathon.repository.MedicineRepository;

@Service
public class MedicineService {

    @Autowired
    private final MedicineRepository repo;

    public MedicineService(MedicineRepository repo) {
        this.repo = repo;
    }


    public Medicine add(Medicine med) {
        return repo.save(med);
    }

    public List<Medicine> getAll() {
        return repo.findAll();
    }

    public void reduceStock(Long id, int qty) {
        Medicine med = repo.findById(id).orElseThrow();
        if (med.getStock() < qty) {
            throw new RuntimeException("Stock not enough");
        }
        med.setStock(med.getStock() - qty);
        repo.save(med);
    }

    public Medicine updateStock(Long id, int stock) {
        Medicine med = repo.findById(id).orElseThrow();
        med.setStock(stock);
        return repo.save(med);
    }

    public Double getPrice(Long id) {
        Medicine med = repo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found: " + id));
        return med.getPrice();
    }
}