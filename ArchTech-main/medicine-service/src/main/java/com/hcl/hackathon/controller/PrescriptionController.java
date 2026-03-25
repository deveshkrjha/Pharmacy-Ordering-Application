package com.hcl.hackathon.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.hcl.hackathon.entity.Prescription;
import com.hcl.hackathon.security.AdminUtil;
import com.hcl.hackathon.security.AuthDetails;
import com.hcl.hackathon.service.PrescriptionService;
import com.hcl.hackathon.dto.PrescriptionUploadRequest;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    // User upload (authenticated; userId set from JWT)
    @PostMapping
    public Prescription upload(@RequestBody PrescriptionUploadRequest request) {
        UsernamePasswordAuthenticationToken auth =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getDetails() == null || !(auth.getDetails() instanceof AuthDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = ((AuthDetails) auth.getDetails()).getUserId();
        Prescription p = new Prescription();
        p.setUserId(userId);
        p.setMedicineId(request.getMedicineId());
        p.setFileUrl(request.getFileUrl());
        return service.upload(p);
    }

    // ADMIN: list all prescriptions
    @GetMapping
    public java.util.List<Prescription> list() {
        AdminUtil.checkAdmin();
        return service.getAll();
    }

    // ADMIN approve
    @PutMapping("/{id}/approve")
    public Prescription approve(@PathVariable Long id) {
        AdminUtil.checkAdmin();
        return service.approve(id);
    }

    // ADMIN reject
    @PutMapping("/{id}/reject")
    public Prescription reject(@PathVariable Long id) {
        AdminUtil.checkAdmin();
        return service.reject(id);
    }
}