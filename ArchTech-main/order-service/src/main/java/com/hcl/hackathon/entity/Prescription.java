package com.hcl.hackathon.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescriptions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String imagePath;

    @Enumerated(EnumType.STRING)
    private Status status;
}
