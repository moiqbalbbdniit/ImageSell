# 🖼️ ImageSell

<p align="center">
  <strong>A Modern Digital Image Marketplace built with Next.js</strong><br/>
  Sell, manage, and deliver downloadable images with secure payments and authentication.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?logo=razorpay" />
  <img src="https://img.shields.io/badge/ImageKit-CDN%20%26%20Storage-orange" />
  <img src="https://img.shields.io/badge/Auth-NextAuth-purple" />
</p>

---

## 🚀 Overview

**ImageSell** is a full‑stack digital assets marketplace where creators can sell downloadable images securely. It supports **admin‑managed products**, **user authentication**, **online payments**, **image hosting**, and **order management** — all built using a modern production‑grade stack.

This project demonstrates real‑world SaaS architecture, payment workflows, and scalable backend design.

---

## ✨ Key Features

### 🛍️ Marketplace

* Browse a clean, responsive product catalog
* Multiple image variants per product
* Dynamic pricing and instant downloads after payment

### 🔐 Authentication

* Secure login/signup using **NextAuth**
* Session‑based access control
* Protected admin routes

### 🧑‍💼 Admin Dashboard

* Create, update, and manage products
* Upload optimized images via **ImageKit**
* Control pricing and availability

### 💳 Payments & Orders

* Razorpay order creation & checkout
* Server‑side payment verification
* Webhook handling for secure confirmation
* Persistent order history stored in MongoDB

### 📦 Backend Architecture

* RESTful API routes using App Router
* Mongoose models with proper relations
* Secure environment‑based configuration

---

## 🧠 Tech Stack

### Frontend

* **Next.js (App Router)**
* **React 18**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Next.js API Routes**
* **MongoDB + Mongoose**
* **NextAuth** for authentication

### Services & Integrations

* **ImageKit** – image upload, CDN & optimization
* **Razorpay** – secure payments & webhooks
* **Nodemailer / Mailtrap** – transactional emails

---

## 📁 Project Structure (High Level)

```
src/
├── app/
│   ├── api/            # REST API routes
│   ├── admin/          # Admin dashboard
│   ├── products/       # Product pages
│   └── orders/         # User orders
├── components/         # Reusable UI components
├── models/             # Mongoose models
├── lib/                # DB, auth & helpers
└── styles/             # Global styles
```

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=

MONGODB_URI=

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

MAILTRAP_USER=
MAILTRAP_PASS=
```

> These are required for authentication, image uploads, payments, and emails.

---

## 🛠️ Getting Started

### Install Dependencies

```
npm install
# or
yarn
# or
pnpm install
```

### Run Development Server

```
npm run dev
```

### Production Build

```
npm run build
npm start
```

---

## 🧪 API Highlights

* `GET /api/products` – fetch product catalog
* `POST /api/products` – create product (admin)
* `POST /api/orders` – create Razorpay order
* `POST /api/verify-payment` – payment verification
* `POST /api/webhook` – Razorpay webhook handler

All sensitive routes are protected via authentication and server‑side checks.

---

## 🌍 Deployment

* Fully compatible with **Vercel**
* Secure secrets management via environment variables
* Optimized for performance and scalability

---

## 👨‍💻 Why This Project Matters

This project showcases:

* Real‑world **full‑stack SaaS architecture**
* Secure **payment gateway integration**
* Production‑ready **authentication & authorization**
* Clean, maintainable, and scalable codebase

Perfect for demonstrating skills required in **startup** and **product‑based companies**.

---

## 📄 License

Refer to the repository’s `package.json` or license file for details.

---

<p align="center">
  <strong>Built with ❤️ using Next.js & modern web technologies</strong>
</p>
