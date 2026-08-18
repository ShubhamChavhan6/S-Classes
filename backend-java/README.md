# ☕ S-Classes Java Backend (Spring Boot 3 REST API)

This directory contains the production-grade **Java Spring Boot backend** for the **S-Classes** EdTech platform.

---

## 🚀 Technology Stack
* **Language:** Java 17 / 21
* **Framework:** Spring Boot 3.2.3
* **Security:** Spring Security + JWT Authentication (`jjwt`)
* **ORM / Database:** Spring Data JPA + H2 In-Memory DB (Dev) / PostgreSQL (Production)
* **Build Tool:** Apache Maven
* **Utilities:** Lombok, Validation

---

## 📂 Architecture Overview

```
backend-java/
├── pom.xml                                   # Maven Dependencies & Plugins
└── src/
    └── main/
        ├── java/com/sclasses/backend/
        │   ├── SClassesApplication.java       # Main Entry Point
        │   ├── config/                        # Security & CORS Config
        │   ├── controller/                    # REST Controllers (/api/auth, /api/courses, /api/users, /api/ai)
        │   ├── dto/                           # Data Transfer Objects
        │   ├── model/                         # JPA Entities (User, Course, Lesson)
        │   ├── repository/                    # Spring Data JPA Repositories
        │   ├── security/                      # JWT Token Provider & Filters
        │   └── service/                       # Business Logic Services
        └── resources/
            └── application.properties         # Server & DB Settings
```

---

## 🛠️ How to Run locally with Java & Maven

1. **Navigate to the backend directory:**
   ```bash
   cd backend-java
   ```

2. **Build the application:**
   ```bash
   mvn clean package
   ```

3. **Run the Spring Boot Application:**
   ```bash
   mvn spring-boot:run
   ```
   Or run the compiled jar:
   ```bash
   java -jar target/sclasses-backend-1.0.0-SNAPSHOT.jar
   ```

4. **Verify Server Running:**
   - Base API URL: `http://localhost:8080`
   - H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:sclassesdb`, User: `sa`, Password: `password`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | User login & JWT issuance |
| `POST` | `/api/auth/register` | User registration with stream/qualification |
| `GET` | `/api/users/me` | Current authenticated profile |
| `PUT` | `/api/users/profile` | Update user qualifications & profile settings |
| `GET` | `/api/courses` | List all courses |
| `GET` | `/api/courses/{id}` | Get course details & syllabus lessons |
| `GET` | `/api/courses/recommendations` | Qualification-matched dynamic recommendations |
| `POST` | `/api/ai/chat` | AI S-Classes Tutor query endpoint |
