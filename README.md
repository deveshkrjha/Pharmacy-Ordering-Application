# 💊 Pharmacy Ordering Website

A **microservices-based Pharmacy Ordering platform** with authentication, medicine catalog, prescription workflow, order management, and role-based dashboards.

---

## 🚀 Live Deployment

- 🌐 **Frontend (Vercel):**  
  https://frontend-omega-plum-59.vercel.app  

- 🔐 **Auth Service:**  
  https://auth-service-production-3ac8.up.railway.app  

- 💊 **Medicine Service:**  
  https://medicine-service-production.up.railway.app  

- 📦 **Order Service:**  
  https://order-service-production-c851.up.railway.app  

- 🗄️ **Database:**  
  MySQL (hosted on Railway private volume)

---

## 🧩 Modules

- `eureka` - Service discovery  
- `gateway` - API gateway  
- `auth-service` - Registration/login + JWT issuing  
- `medicine-service` - Medicines, stock, prescription handling  
- `order-service` - Order placement + analytics  
- `frontend` - React + Vite UI  

---

## 🛠️ Tech Stack

### Backend
- Java 21  
- Spring Boot  
- Spring Security  
- Spring Data JPA  
- Spring Cloud  

### Frontend
- React  
- Redux Toolkit  
- React Router  
- Vite  

### Database
- MySQL  

### Other Tools
- Netflix Eureka (Service Discovery)  
- JWT Authentication  
- Cloudinary (file uploads from frontend)  
- Railway (Backend deployment)  
- Vercel (Frontend deployment)  

---

## ⚙️ System Architecture

- Microservices architecture using **Spring Cloud**
- Services communicate via **REST APIs**
- **Eureka Server** for service discovery
- **API Gateway** as a single entry point
- **JWT-based authentication** for secure access
- **Frontend (React)** interacts with backend services

---

## 📌 Features

- 🔐 User Authentication (JWT-based login/register)  
- 💊 Medicine Catalog & Stock Management  
- 📄 Prescription Upload (Cloudinary integration)  
- 🛒 Order Placement & Tracking  
- 📊 Order Analytics  
- 👤 Role-based access control  
- 🌐 Fully deployed microservices architecture  

---

## 🧪 Local Setup (Optional)

### Prerequisites
- Java 21  
- Maven  
- Node.js + npm  
- MySQL  

### Create Databases
- `user_db`  
- `medicine_db`  
- `order_db`  

---

### ▶️ Run Services (Order)

1. `eureka`  
2. `auth-service`  
3. `medicine-service`  
4. `order-service`  
5. `gateway`  
6. `frontend`  

---

### ▶️ Run Backend (Example)

```bash
cd eureka
./mvnw spring-boot:run