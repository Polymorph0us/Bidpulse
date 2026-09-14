<div align="center">

# âš¡ BidPulse

### A Full-Stack Real-Time Auction Platform

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.10-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-FF6B35?style=for-the-badge&logo=socket.io&logoColor=white)](https://stomp.github.io/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Where every millisecond counts. Bid live, win instantly.*

</div>

---

## ðŸ“– Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Real-Time Bidding Flow](#-real-time-bidding-flow)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

---

## ðŸŽ¯ Overview

**BidPulse** is a production-grade, full-stack real-time auction platform that enables users to create, browse, and participate in live auctions. Built with a modern microservice-ready architecture, BidPulse delivers sub-second bid updates via WebSocket connections, enforces role-based access control, and manages a full wallet/payment lifecycle â€” all wrapped in a sleek React-powered UI.

Whether you're a buyer chasing the thrill of a last-second win or a seller looking to maximize the value of your listings, BidPulse makes the experience fast, fair, and transparent.

---

## âœ¨ Features

### ðŸ”´ Live & Real-Time
- **WebSocket-Powered Bidding** â€” STOMP over SockJS for instant bid broadcasts to all participants in an auction room
- **Live Countdown Timers** â€” Server-driven auction end times with live client-side countdown
- **Real-Time Bid Feed** â€” Every new bid instantly appears for all connected bidders

### ðŸ” Security & Auth
- **JWT Authentication** â€” Stateless access tokens with refresh token rotation
- **Spring Security** â€” Route-level and method-level authorization
- **WebSocket Auth Interceptor** â€” JWT validation on WebSocket handshake
- **Role-Based Access Control** â€” `BUYER`, `SELLER`, and `ADMIN` roles with strict enforcement

### ðŸ’¸ Wallet & Payments
- **Integrated Wallet System** â€” Deposit, withdraw, and track your balance
- **Bid Escrow** â€” Funds reserved on bid; released if outbid
- **Payment Transaction History** â€” Full audit trail of all wallet movements

### ðŸ› Auction Management
- **Full Auction Lifecycle** â€” `DRAFT â†’ ACTIVE â†’ ENDED` state machine
- **Reserve Price** â€” Hidden minimum price sellers can configure
- **Minimum Bid Increments** â€” Configurable per-auction to control bidding pace
- **Image Support** â€” Base64-encoded auction item images stored with listings
- **Optimistic Locking** â€” Concurrent bid protection via JPA `@Version`

### ðŸ‘¤ User & Admin
- **Seller Application System** â€” Users apply to become sellers; admins approve/reject
- **Admin Dashboard** â€” Full platform oversight: users, auctions, applications
- **Seller Dashboard** â€” Manage listings, track bids, monitor active auctions
- **Notification System** â€” In-app notifications for bid events, application status, and wins

### ðŸ—„ Database & Ops
- **Flyway Migrations** â€” Version-controlled schema evolution (no manual SQL)
- **Docker Compose** â€” One command PostgreSQL environment
- **SpringDoc OpenAPI** â€” Auto-generated Swagger UI at `/swagger-ui.html`
- **Spring DevTools** â€” Hot reload during development

---

## ðŸ— Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                        BidPulse Platform                         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚      Frontend (React)     â”‚        Backend (Spring Boot)         â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  React 19 + Vite   â”‚   â”‚   â”‚  Spring Boot 3.5 / Java 17   â”‚  â”‚
â”‚  â”‚  React Router v7   â”‚â—„â”€â”€â”¼â”€â”€â–ºâ”‚  Spring Security + JWT       â”‚  â”‚
â”‚  â”‚  TailwindCSS v4    â”‚   â”‚   â”‚  Spring Data JPA             â”‚  â”‚
â”‚  â”‚  Axios (HTTP)      â”‚   â”‚   â”‚  SpringDoc OpenAPI           â”‚  â”‚
â”‚  â”‚  STOMP/SockJS WS   â”‚â—„â”€â”€â”¼â”€â”€â–ºâ”‚  Spring WebSocket (STOMP)    â”‚  â”‚
â”‚  â”‚  React Toastify    â”‚   â”‚   â”‚  Flyway Migrations           â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                           â”‚                â”‚                      â”‚
â”‚                           â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚                           â”‚   â”‚     PostgreSQL 15             â”‚  â”‚
â”‚                           â”‚   â”‚   (Docker Compose)            â”‚  â”‚
â”‚                           â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Key Design Decisions
- **Stateless REST + Stateful WebSocket** â€” HTTP endpoints for CRUD operations; WebSocket for push events only
- **Optimistic Locking on Bids** â€” Prevents race conditions when multiple users bid simultaneously
- **Flyway for Schema Management** â€” Enables reproducible environments and safe production migrations
- **Role-Based Route Guards** â€” `ProtectedRoute` component enforces role checks at the React router level

---

## ðŸ›  Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 19.x |
| **Build Tool** | Vite | 7.x |
| **Styling** | TailwindCSS | 4.x |
| **HTTP Client** | Axios | 1.x |
| **Real-Time (Client)** | @stomp/stompjs + SockJS | 7.x |
| **Routing** | React Router DOM | 7.x |
| **Notifications (UI)** | React Toastify | 11.x |
| **Backend Framework** | Spring Boot | 3.5.10 |
| **Language** | Java | 17 |
| **Security** | Spring Security + JJWT | 0.11.5 |
| **Database ORM** | Spring Data JPA (Hibernate) | â€” |
| **Database** | PostgreSQL | 15 |
| **DB Migrations** | Flyway | â€” |
| **Real-Time (Server)** | Spring WebSocket (STOMP) | â€” |
| **API Docs** | SpringDoc OpenAPI | 2.2.0 |
| **Build Tool** | Maven | 3.x |
| **DevOps** | Docker Compose | â€” |

---

## ðŸš€ Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Version | Notes |
|------|---------|-------|
| JDK | 17+ | [Download OpenJDK](https://openjdk.org/) |
| Maven | 3.8+ | Included via `mvnw` wrapper |
| Node.js | 20+ | [Download Node.js](https://nodejs.org/) |
| Docker Desktop | Latest | For running PostgreSQL |
| Git | Any | â€” |

---

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/Polymorph0us/Bidpulse.git
cd Bidpulse
```

**2. Start the PostgreSQL database**
```bash
cd bidpulse-backend
docker-compose up -d
```

This spins up a PostgreSQL 15 instance with:
- **Database**: `bidpulse`
- **User**: `bidpulse`
- **Password**: `bidpulse`
- **Port**: `5432`

**3. Configure the application**

Review `bidpulse-backend/src/main/resources/application.properties` and confirm the DB connection settings match. Flyway will automatically run all migrations on startup (`V1__init.sql`, `V2__wallet_notification_payment.sql`, `V3__seed_data.sql`).

**4. Run the backend**
```bash
# Using the Maven wrapper (no local Maven install required)
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The backend starts on **`http://localhost:8080`** by default.

ðŸ“„ **API Documentation**: Visit `http://localhost:8080/swagger-ui.html` for the full interactive OpenAPI spec.

---

### Frontend Setup

**1. Navigate to the frontend**
```bash
cd bidpulse-frontend/bidpulse-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the dev server**
```bash
npm run dev
```

The frontend starts on **`http://localhost:5173`** by default.

---

## ðŸ“ Project Structure

```
Bidpulse/
â”œâ”€â”€ bidpulse-backend/                   # Spring Boot Application
â”‚   â”œâ”€â”€ docker-compose.yml              # PostgreSQL via Docker
â”‚   â”œâ”€â”€ pom.xml                         # Maven dependencies
â”‚   â””â”€â”€ src/main/
â”‚       â”œâ”€â”€ java/com/bidpulse/
â”‚       â”‚   â”œâ”€â”€ config/                 # Security, WebSocket, CORS config
â”‚       â”‚   â”œâ”€â”€ controller/             # REST API endpoints
â”‚       â”‚   â”‚   â”œâ”€â”€ AdminController     # Platform admin operations
â”‚       â”‚   â”‚   â”œâ”€â”€ AuctionController   # Auction CRUD + bidding
â”‚       â”‚   â”‚   â”œâ”€â”€ AuthController      # Login, register, refresh tokens
â”‚       â”‚   â”‚   â”œâ”€â”€ BidController       # Bid submission
â”‚       â”‚   â”‚   â”œâ”€â”€ UserController      # User profile management
â”‚       â”‚   â”‚   â””â”€â”€ WalletController    # Wallet deposit/withdraw
â”‚       â”‚   â”œâ”€â”€ dto/                    # Request/Response data objects
â”‚       â”‚   â”œâ”€â”€ exception/              # Global exception handling
â”‚       â”‚   â”œâ”€â”€ model/                  # JPA Entities
â”‚       â”‚   â”‚   â”œâ”€â”€ User               # Platform users
â”‚       â”‚   â”‚   â”œâ”€â”€ Auction            # Auction listings
â”‚       â”‚   â”‚   â”œâ”€â”€ Bid                # Individual bids
â”‚       â”‚   â”‚   â”œâ”€â”€ Wallet             # User wallets
â”‚       â”‚   â”‚   â”œâ”€â”€ PaymentTransaction  # Wallet history
â”‚       â”‚   â”‚   â”œâ”€â”€ Notification       # User notifications
â”‚       â”‚   â”‚   â”œâ”€â”€ SellerApplication  # Seller approval requests
â”‚       â”‚   â”‚   â”œâ”€â”€ AuditLog           # System audit trail
â”‚       â”‚   â”‚   â””â”€â”€ RefreshToken       # JWT refresh token store
â”‚       â”‚   â”œâ”€â”€ repository/            # Spring Data JPA repositories
â”‚       â”‚   â”œâ”€â”€ scheduler/             # Scheduled jobs (auction expiry, etc.)
â”‚       â”‚   â”œâ”€â”€ security/              # JWT filter, UserDetailsService
â”‚       â”‚   â”œâ”€â”€ service/               # Business logic layer
â”‚       â”‚   â”œâ”€â”€ util/                  # Utility classes
â”‚       â”‚   â””â”€â”€ websocket/             # STOMP interceptor, event payloads
â”‚       â””â”€â”€ resources/
â”‚           â”œâ”€â”€ application.properties
â”‚           â””â”€â”€ db/migration/          # Flyway SQL migrations
â”‚               â”œâ”€â”€ V1__init.sql
â”‚               â”œâ”€â”€ V2__wallet_notification_payment.sql
â”‚               â””â”€â”€ V3__seed_data.sql
â”‚
â””â”€â”€ bidpulse-frontend/
    â””â”€â”€ bidpulse-frontend/              # React + Vite Application
        â”œâ”€â”€ index.html
        â”œâ”€â”€ vite.config.js
        â””â”€â”€ src/
            â”œâ”€â”€ App.jsx                 # Root router configuration
            â”œâ”€â”€ api/                    # Axios API service layer
            â”œâ”€â”€ components/
            â”‚   â”œâ”€â”€ Layout.jsx          # App shell with nav
            â”‚   â”œâ”€â”€ ProtectedRoute.jsx  # Auth + role guard
            â”‚   â””â”€â”€ CountdownTimer.jsx  # Live auction countdown
            â”œâ”€â”€ context/                # React Context (Auth state)
            â””â”€â”€ pages/
                â”œâ”€â”€ LoginPage.jsx       # Authentication
                â”œâ”€â”€ RegisterPage.jsx    # User registration
                â”œâ”€â”€ DashboardPage.jsx   # Buyer auction browser
                â”œâ”€â”€ AuctionRoomPage.jsx # Live bidding room (WebSocket)
                â”œâ”€â”€ SellerDashboard.jsx # Seller listing management
                â”œâ”€â”€ AdminDashboard.jsx  # Admin control panel
                â””â”€â”€ WalletPage.jsx      # Wallet management
```

---

## ðŸ“¡ API Reference

Full interactive documentation is available at **`http://localhost:8080/swagger-ui.html`** when the backend is running.

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT tokens | Public |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/auth/logout` | Invalidate refresh token | JWT |

### Auction Endpoints

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/auctions` | List all active auctions | JWT |
| `GET` | `/api/auctions/{id}` | Get auction details | JWT |
| `POST` | `/api/auctions` | Create a new auction | SELLER |
| `PUT` | `/api/auctions/{id}` | Update auction details | SELLER |
| `DELETE` | `/api/auctions/{id}` | Remove auction | SELLER/ADMIN |

### Bidding

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `POST` | `/api/bids` | Place a bid | BUYER |

### Wallet

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/wallet` | Get wallet balance | JWT |
| `POST` | `/api/wallet/deposit` | Deposit funds | JWT |
| `POST` | `/api/wallet/withdraw` | Withdraw funds | JWT |
| `GET` | `/api/wallet/transactions` | Transaction history | JWT |

### Admin

| Method | Endpoint | Description | Auth |
|--------|---------|-------------|------|
| `GET` | `/api/admin/users` | List all users | ADMIN |
| `GET` | `/api/admin/applications` | Seller applications | ADMIN |
| `POST` | `/api/admin/applications/{id}/approve` | Approve seller | ADMIN |
| `POST` | `/api/admin/applications/{id}/reject` | Reject seller | ADMIN |

### WebSocket

Connect to: `ws://localhost:8080/ws` (via SockJS)

| Topic | Description |
|-------|-------------|
| `/topic/auction/{id}` | Subscribe for live bid updates on an auction |
| `/app/bid` | Send a new bid (STOMP message) |

---

## ðŸ‘¤ User Roles

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     ADMIN                                â”‚
â”‚  Full platform access: approve sellers, manage users,    â”‚
â”‚  view all auctions and audit logs                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                     SELLER                               â”‚
â”‚  Create/manage auction listings, track bids,             â”‚
â”‚  view their wallet balance                               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                     BUYER (default)                      â”‚
â”‚  Browse auctions, enter rooms, place bids,               â”‚
â”‚  manage wallet, apply to become a seller                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

New users register as **BUYER** by default. To become a seller, they submit a `SellerApplication` which an **ADMIN** approves or rejects.

---

## ðŸ”„ Real-Time Bidding Flow

```
Bidder                    Backend                     Other Bidders
  â”‚                          â”‚                              â”‚
  â”‚â”€â”€ POST /api/bids â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚                              â”‚
  â”‚                          â”‚â”€â”€ Validate JWT               â”‚
  â”‚                          â”‚â”€â”€ Check wallet balance       â”‚
  â”‚                          â”‚â”€â”€ Acquire optimistic lock    â”‚
  â”‚                          â”‚â”€â”€ Persist Bid entity         â”‚
  â”‚                          â”‚â”€â”€ Update auction.highestBid  â”‚
  â”‚                          â”‚â”€â”€ Broadcast to /topic/       â”‚
  â”‚â—„â”€ 200 OK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”‚    auction/{id}              â”‚
  â”‚                          â”‚â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚
  â”‚                          â”‚   WS Push: new bid event     â”‚
  â”‚                          â”‚                              â”‚
```

1. Bidder submits bid via REST (`POST /api/bids`)
2. Backend validates auth, wallet balance, and minimum increment
3. Bid is persisted with optimistic lock to handle concurrency
4. Auction's `highestBidAmount` and `highestBidderId` are updated
5. Event is broadcast over STOMP to all subscribers of `/topic/auction/{id}`
6. Every connected client's UI updates instantly â€” no polling required

---

## ðŸ—„ Database Schema

BidPulse uses **Flyway** for schema management. Migrations run automatically on startup.

```
users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  id, email, password_hash, role, created_at    â”‚
       â”‚                                        â”‚
       â”œâ”€â”€â–º seller_application                  â”‚
       â”‚      id, user_id, status, notes        â”‚
       â”‚                                        â”‚
       â”œâ”€â”€â–º wallet                              â”‚
       â”‚      id, user_id, balance              â”‚
       â”‚           â”‚                            â”‚
       â”‚           â””â”€â”€â–º payment_transaction     â”‚
       â”‚                  id, wallet_id, type,  â”‚
       â”‚                  amount, status        â”‚
       â”‚                                        â”‚
       â””â”€â”€â–º auction â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              id, seller_id, title, description,
              starting_price, min_increment,
              reserve_price, start_time, end_time,
              status, highest_bid_amount,
              highest_bidder_id, version
                   â”‚
                   â””â”€â”€â–º bid
                          id, auction_id, bidder_id,
                          amount, status, placed_at

notifications
  id, user_id, type, message, is_read, created_at

audit_log
  id, action, performed_by, target_id, timestamp

refresh_tokens
  id, token, user_id, expiry_date
```

---

## ðŸ¤ Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add some feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** targeting `main`

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use For |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation updates |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Build process or tooling changes |

---

<div align="center">

**Built with â¤ï¸ using Spring Boot & React**

â­ Star this repo if you find it useful!

</div>

