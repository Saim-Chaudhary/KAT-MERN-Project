# KAT MERN Project

Full-stack travel agency management system built with MongoDB, Express, React, and Node.js.

## Project Structure

```
KAT_Project
├─ backend
│  ├─ .env.example
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  ├─ models
│  │  ├─ Airline.js
│  │  ├─ Booking.js
│  │  ├─ Contact.js
│  │  ├─ CustomRequest.js
│  │  ├─ Document.js
│  │  ├─ DocumentType.js
│  │  ├─ Expense.js
│  │  ├─ ExpenseCategory.js
│  │  ├─ Guide.js
│  │  ├─ Hotel.js
│  │  ├─ Package.js
│  │  ├─ Passenger.js
│  │  ├─ Payment.js
│  │  ├─ SeasonalPrice.js
│  │  ├─ Service.js
│  │  ├─ Testimonial.js
│  │  └─ User.js
│  ├─ routes
│  └─ server.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
├─ package.json
└─ README.md
```

## Environment Setup

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` and must stay out of version control.

1. Copy the example file and fill in your own values:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Edit `backend/.env` with your real credentials (MongoDB URI, JWT secret, etc.).
3. The `.env` file is git-ignored and will not be tracked.

If you accidentally commit a `.env` file containing real secrets, **rotate those credentials immediately** (change your MongoDB password, generate a new JWT secret, etc.) before continuing.