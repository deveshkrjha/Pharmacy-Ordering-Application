package com.hcl.hackathon.client;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class MedicineClient {

    @Value("${medicine.service.url}")
    private String medicineServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Double getMedicinePrice(Long medicineId) {
        return restTemplate.getForObject(
                medicineServiceUrl + "/medicines/" + medicineId + "/price",
                Double.class);
    }

    public void reduceStock(Long medicineId, Integer quantity) {
        restTemplate.postForObject(
                medicineServiceUrl + "/medicines/" + medicineId + "/reduce?qty=" + quantity,
                null,
                Void.class);
    }
}
