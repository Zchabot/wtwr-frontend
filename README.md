# What to Wear (WTWR) – Frontend

Modular React frontend for a weather-based outfit planner application. Dynamically renders clothing suggestions based on real-time weather data.

---

## 🌍 Live Demo

https://wtwrzc.port0.org/

---

## 📸 Screenshots

![Home Screen Logged In](./src/assets/demo/home-logged-in.png)
![Home Screen Logged Out](./src/assets/demo/home-logged-out.png)
![Sign Up Modal](./src/assets/demo/modal-1.png)
![Sign In Modal](./src/assets/demo/modal-2.png)
![New Garment Modal Empty](./src/assets/demo/modal-3.png)
![New Garment Modal Filled](./src/assets/demo/modal-4.png)
![Change Profile Modal](./src/assets/demo/modal-5.png)
![Clothing Item Modal](./src/assets/demo/modal-6.png)
![Delete Confirmation Modal](./src/assets/demo/modal-7.png)
![User Profile Page](./src/assets/demo/profile-page.png)
![Temperature Unit Switch](./src/assets/demo/temp-unit-switch.png)
![Weather Display Fahrenheit](./src/assets/demo/temp-f.png)
![Weather Display Celsius](./src/assets/demo/temp-c.png)
![Home Screen Mobile](./src/assets/demo/mobile-home.png)
![Mobile Menu](./src/assets/demo/mobile-menu.png)
![Mobile Profile Page](./src/assets/demo/mobile-profile.png)
![Mobile Sign Up Modal](./src/assets/demo/mobile-sign-up.png)

---

## 📌 Overview

WTWR provides clothing recommendations based on current weather conditions. The frontend integrates with a backend API to manage user accounts and clothing items.

---

## 🛠 Tech Stack

- React
- JavaScript (ES6+)
- CSS
- REST API Integration

---

## ✨ Key Features

- Weather API integration
- Dynamic UI updates
- User authentication support
- Item management (add/remove)
- Loading states and error handling

---

## ⚙️ Run Locally

### Prerequisites

- Node.js (v23.x recommended — npm included)
- What to Wear (WTWR) backend running (see backend README)

The frontend is configured to connect to the backend at:
http://localhost:3001 when running locally.

### Setup

```bash
git clone https://github.com/Zchabot/wtwr-frontend.git
cd wtwr-frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will run at:
http://localhost:3000

### API Configuration

The frontend automatically connects to:

- `http://localhost:3001` during local development
- The deployed backend API in production builds

To use a different backend, update the `baseUrl` configuration in:

`src/utils/constants.js`
