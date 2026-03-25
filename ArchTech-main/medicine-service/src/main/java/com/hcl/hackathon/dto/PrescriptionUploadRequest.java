package com.hcl.hackathon.dto;

import lombok.Data;

@Data
public class PrescriptionUploadRequest {
    private Long medicineId;
    private String fileUrl;
}
