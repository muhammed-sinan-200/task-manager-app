# Task Manager App

A full-stack Task Manager application built using the MERN stack. Users can register, log in, and manage their personal tasks through a responsive dashboard.

## Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Create, edit, and delete tasks
* Mark tasks as pending or completed
* Task priorities: Low, Medium, High
* Optional task due dates
* Search tasks by title
* Filter tasks by status
* Pagination
* Task statistics and completion percentage
* Responsive UI
* Dark/Light theme

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* dotenv
* CORS

## Setup

### Prerequisites

* Node.js
* MongoDB or MongoDB Atlas
* npm

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

If required, create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Project Structure

```text
task-manager-app/
├── backend/
├── frontend/
└── README.md
```

## Demo

Live application:

https://task-manager-app-tau-lilac.vercel.app/

Backend API:

https://task-manager-app-aeve.onrender.com