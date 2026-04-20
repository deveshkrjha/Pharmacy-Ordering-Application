# Pharmacy Ordering Website
devesh kumar jha

A microservices-based Pharmacy Ordering platform with authentication, medicine catalog, prescription workflow, order management, and role-based dashboards.

## Modules

- `eureka` - Service discovery
- `gateway` - API gateway
- `auth-service` - Registration/login + JWT issuing
- `medicine-service` - Medicines + stock + prescriptions
- `order-service` - Order placement + analytics
- `frontend` - React + Vite UI

## Tech Stack

- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, Spring Cloud
- **Frontend:** React, Redux Toolkit, React Router, Vite
- **Database:** MySQL
- **Service Discovery:** Netflix Eureka
- **Auth:** JWT
- **File Upload:** Cloudinary (from frontend)

---

## Prerequisites

- Java 21
- Maven (or use each module’s `mvnw.cmd`)
- Node.js + npm
- MySQL

Create databases:

- `user_db`
- `medicine_db`
- `order_db`

---

## Default Ports (from current config)

- Eureka: `8761`
- Gateway: `8080`
- Auth Service: `8081`
- Medicine Service: `8082`
- Order Service: `8083`
- Frontend (Vite): `5173`

---

## Run Order

Start services in this order:

1. `eureka`
2. `auth-service`
3. `medicine-service`
4. `order-service`
5. `gateway` (optional for local frontend proxy flow)
6. `frontend`

### Backend commands (Windows PowerShell)

```powershell
cd "C:\Users\Devesh Kumar Jha\Desktop\Pharmacy-Ordering-Application\eureka"
.\mvnw.cmd spring-boot:run
