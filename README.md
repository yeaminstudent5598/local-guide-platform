












# 🗺️ Vistara - Local Guide Platform

![Vistara Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop)

**Vistara** is a full-stack travel platform connecting travelers with passionate local experts. Unlike generic tour agencies, Vistara empowers locals to monetize their knowledge and offers travelers authentic, off-the-beaten-path experiences.

### 🔗 Live Links
- **Live Site:** [https://your-vercel-link.app](https://your-vercel-link.app)
- **Backend API:** `Next.js API Routes`
- **Project Video:** [Watch Explanation Video](https://youtube.com/your-video-link)

---

## 🚀 Features

### 🌟 Core Features
- **Role-Based Access Control (RBAC):** Separate dashboards for **Admin**, **Guide**, and **Tourist**.
- **Secure Authentication:** JWT-based auth with **OTP Verification** (via Redis & Nodemailer).
- **Tour Management:** Guides can create, edit, delete, and manage tour listings.
- **Booking System:** Tourists can request bookings; Guides can Accept/Reject them.
- **Payment Gateway:** Secure payment integration using **SSLCommerz (Sandbox)**.
- **Reviews & Ratings:** Tourists can rate and review guides after trip completion.
- **Advanced Search:** Filter tours by location, price, and date.

### 🎁 Bonus Features
- **📅 Availability Calendar:** Guides can block specific dates.
- **📊 Dynamic Dashboard:** Real-time charts (Recharts) for earnings and booking stats.
- **❤️ Wishlist:** Tourists can save their favorite tours.
- **🌍 Multi-language Support:** English and Bengali language toggle.
- **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Desktop.
- **🗺️ Interactive Map:** Leaflet map integration for tour locations.

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Shadcn UI
- **Animation:** Framer Motion
- **State Management:** React Hooks, Context API
- **Forms:** React Hook Form + Zod

**Backend:**
- **Runtime:** Next.js Server Actions & API Routes
- **Database:** PostgreSQL (Neon Tech)
- **ORM:** Prisma
- **Auth:** JWT, Bcrypt
- **Caching:** Redis (Upstash/Redis Cloud)

**Services:**
- **Payment:** SSLCommerz
- **Email:** Nodemailer (Gmail SMTP)
- **Image Upload:** Cloudinary / ImgBB

---

## 📸 Screenshots

| Landing Page | Dashboard |
| --- | --- |
| ![Landing](https://i.ibb.co.com/36KNsLk/image.png) | ! [Dashboard](https://i.ibb.co.com/KzLrddqy/image.png) |

---

## ⚙️ Installation & Run Locally

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/local-guide-platform.git](https://github.com/your-username/local-guide-platform.git)
cd local-guide-platform

```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install

```

### 3. Environment Setup

# Create a .env file in the root directory and add the following variables:

```bash 

# App
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/db_name?sslmode=require"

# Auth Secret
AUTH_SECRET="your_generated_secret_key"

# Redis (For OTP)
REDIS_HOST="your-redis-host"
REDIS_PORT=14134
REDIS_PASSWORD="your-redis-password"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password" # Not login password
SMTP_FROM="your-email@gmail.com"

# SSLCommerz (Payment)
SSL_STORE_ID="your_store_id"
SSL_STORE_PASS="your_store_pass"
IS_LIVE=false

# Cloudinary (Image Upload) - Optional if using backend upload
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

```

### 4. Database Migration

```bash

pnpm prisma generate
pnpm prisma db push

```

### 5. Run the Server

```bash

pnpm dev
```

**Open http://localhost:3000 in your browser.**

### 🔐 Admin Credentials (Testing)

**You can create an admin manually in the database or use the seed script.**

***Email: admin@vistara.com***

***Password: password123***

***Role: ADMIN***


### 🌐 API Documentation (Overview)

## 📝 API Endpoints

Here is a comprehensive list of the available API endpoints for the application.

### 🔐 Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | User Registration (Sends OTP) |
| **POST** | `/api/v1/auth/login` | User Login |
| **POST** | `/api/v1/auth/verify` | Verify OTP |

### 👤 User Management

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/profile` | Get User Profile |
| **PUT** | `/api/v1/profile` | Update User Profile |
| **GET** | `/api/v1/admin/users` | Admin: Get All Users |

### 🏠 Listings

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/listings` | Get All Listings |
| **POST** | `/api/v1/listings` | Create New Listing |
| **GET** | `/api/v1/listings/:id` | Get Single Listing Details |
| **PUT** | `/api/v1/listings/:id` | Update Listing |
| **DELETE** | `/api/v1/listings/:id` | Delete Listing |

### 📅 Bookings

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/bookings` | Create New Booking |
| **GET** | `/api/v1/bookings` | Get All Bookings |
| **PATCH** | `/api/v1/bookings/:id` | Update Status (Accept/Reject) |

### 💳 Payments

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/payments/init` | Initialize Payment |


### 🤝 Contributing

**Contributions are welcome! Please feel free to submit a Pull Request.**

### 📄 License
***This project is licensed under the MIT License.***