📦 Product Database Manager

A full-stack web app for creating, editing, and managing products inside customizable databases.
The purpose of this app is to provide a flexible way to manage products where the user has full control over how the data is structured.

Each database defines its own schema (fields), and products automatically follow that schema dynamically — meaning you decide what information is tracked (e.g., name, price, category, SKU, etc.), and the app adapts to it.

This app was built for a client who wanted a dedicated product management system connected to the same MongoDB database used by their e-commerce website. With this setup, they can manage products here, and the changes reflect in their e-commerce site as well.



✨ Features

🔑 Databases

Each database has a custom schema with fields (text, number, etc.)
Products belong to a database and follow its schema

📝 Products

Create products with dynamic fields based on the database schema
Edit and update product details
Delete products with confirmation dialog
Product cards display key info (name, schema, database, creation date)

⚡ UI

Clean card-based layout using TailwindCSS + DaisyUI
Toast notifications for success/error feedback
Rate-limit UI handling for API throttling
Automatic date formatting

🛠️ Tech Stack

Frontend: React, React Router, TailwindCSS (DaisyUI), Lucide Icons, react-hot-toast
Backend: Node.js + Express + MongoDB (Mongoose)
Database: MongoDB Atlas
Rate Limiting: Upstash Redis

🚀 Deployment

1. Environment Variables

Add the following in your Environment Variables settings:

MONGO_URI=your-mongodb-uri
PORT=5001
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token

2. Scripts

The project is configured with Render-compatible scripts:

"scripts": {
  "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
  "start": "npm run start --prefix backend"
}

-build will install dependencies for both backend and frontend, then build the frontend.
-start will launch the backend server (which serves the API + frontend build).

3. Render Setup

Push your code to GitHub
Create a new Render Web Service
Connect your GitHub repo

Select:
Build Command: npm run build
Start Command: npm start

Add the environment variables listed above
Deploy 🚀

🌐 Live Demo

You can view a sample deployment of this project here:
https://productdatabase-wus7.onrender.com/

