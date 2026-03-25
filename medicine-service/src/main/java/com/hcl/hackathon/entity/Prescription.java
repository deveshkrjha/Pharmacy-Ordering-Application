package com.hcl.hackathon.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long medicineId;
    private String status; // PENDING / APPROVED / REJECTED

    /** Cloudinary (or other) URL of the uploaded prescription PDF/image. */
    @Column(name = "file_url", length = 2048)
    private String fileUrl;
}