<div align="center">
  <a href="https://estiator.io" target="_blank">
    <img src=".assets/logo.png" width="250" alt="Estiator Logo" />
  </a>

  <h3>The Open Source Management Platform for F&B Businesses</h3>

  <p>
    A full-stack web application offering a complete management solution for Restaurants 
    and Food & Beverage businesses. Developed as part of a Master's Thesis.
  </p>
</div>

> [!CAUTION]
> **Not Production Ready**: This is an academic prototype containing known architectural and security limitations. It is strictly for educational and demonstration purposes only. **Do not use this application in a production environment.**


<div align="center">

  <img src="https://img.shields.io/badge/react-v18.3-%23007fa2?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-v5.6-%233178c6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/vite-v5.4-%23ffd747?style=for-the-badge&logo=vite&logoColor=black">
  <img src="https://img.shields.io/badge/heroui-v2.6-%23d03bf3?style=for-the-badge">
  <img src="https://img.shields.io/badge/tailwindcss-v3.4-%23a1f4fb?style=for-the-badge&logo=tailwindcss&logoColor=black">
  
  <br/>

  <img src="https://img.shields.io/badge/java-v21-c0392b?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src="https://img.shields.io/badge/spring_boot-v3.3-6db33f?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-v8-3e6e93?style=for-the-badge&logo=mysql&logoColor=white">

</div>

<br />

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Getting Started (Docker)](#-getting-started-docker)
- [Development Setup (Manual)](#-development-setup-manual)
- [Testing & Credentials](#-testing--credentials)
- [Gallery](#-gallery)

---

## 🛠 Tech Stack

This project uses a modern full-stack architecture, separating the client and server responsibilities.

| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Client** | [React](https://react.dev/) | 18.3 | Frontend UI library |
| | [HeroUI](https://www.heroui.com/) | 2.6 | Component library (NextUI fork) |
| | [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS framework |
| | [TypeScript](https://www.typescriptlang.org/) | 5.6 | Statically typed JavaScript |
| **Server** | [Java](https://www.java.com/) | 21 | Core language |
| | [Spring Boot](https://spring.io/projects/spring-boot) | 3.3 | Backend framework |
| **Data** | [MySQL](https://www.mysql.com/) | 8.0 | Relational database |

<br />

## 🐳 Getting Started (Docker)

The application is fully containerized. You can run the entire stack (Client, Server, Database) with a single command.

### Prerequisites
* **Docker Desktop** (Download [here](https://www.docker.com/products/docker-desktop/))

> [!IMPORTANT]
> **Environment Setup**: Before running Docker, ensure you have the necessary configuration files.
> 1. `database.env` in the root directory.
> 2. `.env` in the `server` directory.
>
> Refer to `example.database.env` and `example.env` for the required structure.

### Option A: Build from Source
Use this method if you want to contribute or modify the code.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/CptGeo/estiator](https://github.com/CptGeo/estiator)
    cd estiator
    ```

2.  **Build and Run**
    ```bash
    docker compose up --build
    ```

### Option B: Minimal Run (Standalone)
You do not need the full codebase to run the application. You only need 3 specific files.

1.  **Create the Directory Structure**
    Place the files as shown below:
    ```text
    ├── docker-compose.yml   <-- (Get from repository root)
    ├── database.env         <-- (Copy from example.database.env)
    └── server
        └── .env             <-- (Copy from example.env)
    ```

2.  **Run Containers**
    Navigate to the root folder containing `docker-compose.yml` and run:
    ```bash
    docker compose up --build
    ```

### What happens next?
Docker will spin up three containers:
* `app-database`: MySQL 8 (pre-populated with `db-init.sql`).
* `app-server`: Spring Boot backend.
* `app-client`: React frontend.



Once finished, access the app at: **[http://localhost:8080](http://localhost:8080)**

<br />

## 💻 Development Setup (Manual)

Follow these steps if you wish to run the application locally without Docker.

### Prerequisites
Ensure your system meets the following requirements:
* **NodeJS** (v20+)
* **JDK 21**
* **MySQL 8**
* **Git**

### 1. Database Setup
Before starting the application, the database must be ready.

1.  **Create Database:**
    Connect to your local MySQL instance and run:
    ```sql
    CREATE DATABASE `estiator` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
    ```
2.  **Populate Data:**
    * Locate the file `db.sql` in the project root.
    * Import this file into your new `estiator` database using a tool like Workbench or DBeaver.

### 2. Server Setup
1.  **Configure Properties:**
    Navigate to `server/src/main/resources/application.properties` and update your database credentials:
    ```properties
    # Database Configuration
    spring.datasource.url=jdbc:mysql://localhost:3306/estiator
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD

    # Security (Base64 encoded string)
    app.jwt-secret=YOUR_SECRET_KEY
    ```

2.  **Run Server:**
    From the `server` directory, run:
    ```bash
    ./gradlew bootRun
    ```

### 3. Client Setup
1.  **Install Dependencies:**
    From the `client` directory, run:
    ```bash
    npm install
    ```

2.  **Start Frontend:**
    ```bash
    npm run dev
    ```

<br />

## 💻 Development Setup (Manual)

Follow these steps if you wish to run the application locally without Docker.

### Prerequisites
Ensure your system meets the following requirements:
* **NodeJS** (v20+)
* **JDK 21**
* **MySQL 8**
* **Git**

### 1. Database Setup
1.  **Import Schema & Data:**
    * Locate the `db.sql` file in the project root.
    * Import this file into your local MySQL server (using command line or a tool like Workbench/DBeaver).
    * *Note: This script will automatically create the `estiator` database and populate it with dummy data.*

### 2. Server Setup
1.  **Configure Properties:**
    Navigate to `server/src/main/resources/application.properties` and update your database credentials:
    ```properties
    # Database Configuration
    spring.datasource.url=jdbc:mysql://localhost:3306/estiator
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD

    # Security (Base64 encoded string)
    app.jwt-secret=YOUR_SECRET_KEY
    ```

2.  **Run Server:**
    From the `server` directory, run:
    ```bash
    ./gradlew bootRun
    ```

### 3. Client Setup
1.  **Install Dependencies:**
    From the `client` directory, run:
    ```bash
    npm install
    ```

2.  **Start Frontend:**
    ```bash
    npm run dev
    ```

<br />

## 🔐 Testing & Credentials

The database is pre-populated with the following user accounts for demonstration purposes.

| Email | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin@estiator.io` | `12341234` | **Admin** | Full System Access |
| `moderator@estiator.io` | `12341234` | **Moderator** | Restricted / Read-only in specific areas |

<br />

## 📸 Gallery

<details>
  <summary><strong>Click to expand application screenshots</strong></summary>
  <br />

  <h4>Login Page</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo login page" src=".assets/demo_login_page.png" />
  <br /><br />

  <h4>Register Page</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo register page" src=".assets/demo_register_page.png" />
  <br /><br />

  <h4>Dashboard</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo dashboard" src=".assets/demo_dashboard.png" />
  <br /><br />

  <h4>Reservations Management</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo Reservations Management" src=".assets/demo_reservations_management.png" />
  <br /><br />

  <h4>Tables Management</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo Tables Management" src=".assets/demo_tables_management.png" />
  <br /><br />

  <h4>Employees Management</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo Employees Management" src=".assets/demo_employees_management.png" />
  <br /><br />

  <h4>Customers Management</h4>
  <img style="border:2px solid #f5a524; border-radius:5px; box-shadow: 1px 2px 10px rgba(25,25,25,.3)" alt="Demo Customers Management" src=".assets/demo_customers_management.png" />

</details>
