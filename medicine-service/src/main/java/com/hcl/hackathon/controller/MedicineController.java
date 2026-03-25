package com.hcl.hackathon.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.hcl.hackathon.entity.Medicine;
import com.hcl.hackathon.security.AdminUtil;
import com.hcl.hackathon.service.MedicineService;

@RestController
@RequestMapping("/medicines")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class MedicineController {

    private final MedicineService service;

    public MedicineController(MedicineService service) {
        this.service = service;
    }

    // ADMIN only
    @PostMapping
    public Medicine add(@RequestBody Medicine med) {
        AdminUtil.checkAdmin();
        return service.add(med);
    }

    // All authenticated users + allow for frontend catalog
    @GetMapping
    public List<Medicine> getAll() {
        return service.getAll();
    }

    // Order service: get price by id
    @GetMapping("/{id}/price")
    public Double getPrice(@PathVariable Long id) {
        return service.getPrice(id);
    }

    // Order service call (POST used by order-service client)
    @PostMapping("/{id}/reduce")
    public void reducePost(@PathVariable Long id, @RequestParam("qty") int qty) {
        service.reduceStock(id, qty);
    }

    // Order service call (PUT alternative)
    @PutMapping("/{id}/reduce")
    public void reduce(@PathVariable Long id, @RequestParam int qty) {
        service.reduceStock(id, qty);
    }

    // ADMIN only
    @PutMapping("/{id}/stock")
    public Medicine updateStock(@PathVariable Long id, @RequestParam int stock) {
        AdminUtil.checkAdmin();
        return service.updateStock(id, stock);
    }
}