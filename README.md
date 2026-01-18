# 🖼️ ImageSell

ImageSell is a modern **digital assets marketplace** built with Next.js for selling downloadable images. The platform supports product management, secure payments, and user authentication, providing a complete end-to-end solution for creators to sell digital images online.

---

## 🚀 Overview

ImageSell enables creators to upload, manage, and sell digital images with multiple variants and pricing options. Buyers can securely authenticate, purchase images, and access downloads after successful payment.

The application is built using a scalable full-stack architecture with a focus on performance, security, and developer experience.

---

## ✨ Features

* Product catalog with multiple image variants and pricing options
* Admin dashboard to create and manage products
* Image uploads and delivery using ImageKit
* Secure payment flow using Razorpay with server-side verification
* Webhook handling for payment confirmation
* User authentication and sessions using NextAuth
* Order management and purchase history
* Email notifications using Nodemailer

---

## 🛠️ Tech Stack

### Frontend

* Next.js with App Router
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* MongoDB with Mongoose

### Integrations

* ImageKit for image hosting and optimization
* Razorpay for payments and webhooks
* NextAuth for authentication
* Nodemailer for transactional emails

---

## ⚡ Quick Start

Follow the steps below to run the project locally.

### Install Dependencies

```
npm install
```

Or using pnpm or yarn

```
pnpm install
```

```
yarn install
```

---

### Local Development

```
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

### Build and Start

```
npm run build
npm run start
```

All scripts are defined in the package.json file.

---

## 🔐 Environment Variables

Create a .env.local file in the root directory and add the following variables:

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
MONGODB_URI=

NEXT_PUBLIC_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_URL_ENDPOINT=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

MAILTRAP_USER=
MAILTRAP_PASS=
```

These variables are required for authentication, database connection, image uploads, payments, and email notifications.

---

## 🗂️ Project Structure

High-level overview of the project structure:

* src/app — Next.js App Router pages and API routes
* src/app/api — REST APIs for products, orders, payments, webhooks, and authentication
* src/components — Reusable UI components such as ProductCard, AdminProductForm, FileUpload, and Notification
* src/models — Mongoose models for User, Product, and Order
* src/lib — Utility helpers including database connection, auth configuration, and API utilities

---

## 🔌 API Notes

The application exposes REST API routes under src/app/api for:

* Products: Fetch and create products (admin protected)
* Orders: Create orders and fetch user order history
* Payments: Razorpay order creation, payment verification, and webhook handling
* Authentication: NextAuth powered auth routes

Refer to the individual route files for request and response formats.

---

## 🌐 Deployment Tips

* Deploy the project on Vercel for best Next.js support
* Ensure all environment variables are configured in the production environment
* Set Razorpay webhook secrets correctly to avoid payment verification issues

---

## 🤝 Contributing

Contributions are welcome.

* Open an issue describing the bug or feature
* Create a pull request following the existing code style
* Ensure TypeScript types remain consistent

Note: Automated tests are not included in this project.

---

## 📝 License

Please refer to the repository top-level files for licensing information. Project metadata and license details are available in the package.json file.

---

<p align="center">Built with ❤️ using Next.js</p>
