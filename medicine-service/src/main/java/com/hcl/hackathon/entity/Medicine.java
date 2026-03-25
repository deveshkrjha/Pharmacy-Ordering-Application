package com.hcl.hackathon.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private double price;
    private int stock;
    private boolean requiresPrescription;
    private String dosage;      // e.g. 500mg
    private String packaging;   // e.g. Strip of 10


    // getters and setters
}