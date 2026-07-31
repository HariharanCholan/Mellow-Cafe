# ☕ Mellow Café - Digital Ordering Platform

Mellow Café is a premium, full-stack digital ordering web application designed for a modern café experience. It allows customers to browse a rich, interactive menu, customize orders (such as selecting milkshake flavors), manage their cart with scheduled pickup times, pay securely via Razorpay, and download automatically generated PDF invoices.

The platform provides a smooth, animated user interface built with React, Tailwind CSS, and Framer Motion, backed by a robust Node.js/Express server and MongoDB database.

---

## 🚀 Key Features

### 🔐 1. Multi-Method Authentication
* **Local Accounts:** Secure user registration and login with password hashing (`bcryptjs`).
* **Email OTP Verification:** Registration is secured with a 6-digit One-Time Password (OTP) verification system sent via Gmail using `nodemailer` and verified securely via transient JWT tokens.
* **Google OAuth Sign-In:** One-click registration and login using Firebase Client Authentication and Google Auth Provider.

### 📋 2. Interactive Menu & Customization
* **Categorized Browsing:** Browse items across 13 culinary categories (Hot & Cold Beverages, Starters, Sandwiches, Pizzas, Cakes, Pies, Pastries, Snacks, Cookies, Doughnuts, Breads, etc.).
* **Customization Dialogs:** Dynamic selection options for items with variants (e.g., choice of flavor for milkshakes: Vanilla, Strawberry, Butterscotch, Blackcurrant, Mango) using Radix UI Dialogs.
* **Stock Indicators:** Live stock indicators disable ordering when items are out of stock.

### 🛒 3. Cart & Pickup Management
* **Real-time Calculations:** Quantities, subtotals, and total costs update dynamically.
* **Scheduled Pickup:** Customers can select a convenient pickup slot from dynamically calculated hourly intervals.

### 💳 4. Razorpay Payment Gateway & PDF Invoices
* **Secure Sandbox Checkout:** Secure order creation and payment authorization matching Razorpay API standards.
* **HmacSHA256 Verification:** Server-side validation of signatures ensures payment legitimacy.
* **PDF Invoices:** Generates dynamic, custom PDF receipts containing order details, breakdown of items, date, payment ID, and total amount using `pdfkit`. Served statically.

### 👤 5. Customer Profile & Order History
* **Order Archive:** View previous purchases sorted in descending order of time.
* **Smart Analytics:** Automatically calculates and displays the user's top 3 "Favorite Dishes" based on order frequency.
* **Reorder & Include All:** Quick checkout options to either overwrite the current cart with a past order or append all items from a past order into the current cart.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 18, Vite, React Router DOM v6 |
| **Styling & UI** | Tailwind CSS, Radix UI primitives, Lucide Icons |
| **Animations** | Framer Motion (page transitions, float animations, interactive hover effects) |
| **SEO & Metadata** | React Helmet (dynamic document head management) |
| **Backend Framework** | Node.js, Express (v5.x) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | Firebase Client SDK (OAuth & Google Auth), JWT (for transient OTP tokens) |
| **Payment Gateway** | Razorpay Node.js SDK + Razorpay Checkout integration |
| **Utilities** | PDFKit (server-side PDF generation), Nodemailer (email transport) |

---

## 📁 Repository Structure

```text
Mellow Cafe project official/
├── Client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components & UI layout
│   │   │   ├── ui/              # Radix UI primitives (dialog, button, input, toast)
│   │   │   ├── FlavorDialog.jsx # Option selection dialog for variants
│   │   │   └── Layout.jsx       # Main layout wrapper (Navbar & Footer)
│   │   ├── contexts/            # Context API Providers
│   │   │   ├── AuthContext.jsx  # Authentication state & helper operations
│   │   │   └── CartContext.jsx  # Cart state (add, update, clear, counts)
│   │   ├── data/
│   │   │   └── menu.js          # Hardcoded café categories and products list
│   │   ├── pages/               # Page views
│   │   │   ├── CartPage.jsx     # Cart overview, pickup slot, payment trigger
│   │   │   ├── CategoryPage.jsx # Items inside a category list
│   │   │   ├── HomePage.jsx     # Main menu categories page
│   │   │   ├── LandingPage.jsx  # Animated landing screen
│   │   │   ├── LoginPage.jsx    # Login form & Google Auth
│   │   │   ├── SignupPage.jsx   # Register form & OTP email verification
│   │   │   ├── ProfilePage.jsx  # Customer dashboard, orders list, favorites
│   │   │   └── SplashPage.jsx   # Temporary welcome loading splash
│   │   ├── App.jsx              # Client routing and component layout setup
│   │   ├── firebase.js          # Firebase Client Config and Recaptcha initialization
│   │   └── main.jsx             # React entry point
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── vite.config.js           # Vite development server configuration
│
└── Server/                      # Express Backend Application
    ├── config/
    │   └── firebaseAdmin.cjs    # Firebase Admin SDK initialization
    ├── invoices/                # Folder where generated invoice PDFs are stored
    ├── models/                  # Mongoose MongoDB Schemas
    │   ├── User.cjs             # Local registered user model
    │   ├── googleUserModel.cjs  # Google OAuth logged user model
    │   └── Orders.cjs           # Placed orders history model
    ├── routes/                  # API Express Routers
    │   ├── authroutes.cjs       # Login, register, and google OAuth signup endpoints
    │   ├── order_routes.cjs     # Save orders (called upon confirmation)
    │   ├── otpRoutes.cjs        # Send and verify email OTPs
    │   ├── paymentRoutes.cjs    # Razorpay order generation & payment verify
    │   └── profile_routes.cjs   # User details & order history endpoints
    ├── utils/                   # Server utility modules
    │   ├── generateInvoice.cjs  # PDF invoice builder using PDFKit
    │   └── mailer.cjs           # SMTP Gmail Nodemailer transporter
    ├── .env                     # Server configuration & API keys (ignored in Git)
    ├── server.cjs               # Server startup and main app entry point
    └── package.json             # Backend dependencies
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* Install [Node.js](https://nodejs.org/) (Recommended version listed in `.nvmrc`)
* A running [MongoDB Instance](https://www.mongodb.com/) (Local or Atlas URI)
* A [Razorpay Test Account](https://razorpay.com/) (For credentials)
* A Gmail account with [App Passwords](https://support.google.com/accounts/answer/185833) enabled (For OTP delivery)

### 2. Backend Setup
1. Navigate to the `Server` folder:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Server` folder and populate it:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mellowcafe
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
4. Start the backend server:
   ```bash
   node server.cjs
   ```
   *The server runs by default on `http://localhost:5000`.*

### 3. Frontend Setup
1. Navigate to the `Client` folder:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## 📝 License
This project is licensed under the ISC License.
