package com.hcl.hackathon.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hcl.hackathon.entity.Prescription;
import com.hcl.hackathon.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private final PrescriptionRepository repo;

    public PrescriptionService(PrescriptionRepository repo) {
        this.repo = repo;
    }

    public List<Prescription> getAll() {
        return repo.findAll();
    }

    public Prescription upload(Prescription p) {
        p.setStatus("PENDING");
        return repo.save(p);
    }

    public Prescription approve(Long id) {
        Prescription p = repo.findById(id).orElseThrow();
        p.setStatus("APPROVED");
        return repo.save(p);
    }

    public Prescription reject(Long id) {
        Prescription p = repo.findById(id).orElseThrow();
        p.setStatus("REJECTED");
        return repo.save(p);
    }
}