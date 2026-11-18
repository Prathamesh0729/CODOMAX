# CODOMAX BlogSpace

A full-stack blog application built as part of the CODOMAX project. BlogSpace allows users to register, log in, create and manage blog posts, save drafts, publish content, and explore published blogs.

## Features

### Authentication and Security
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes and user-specific access
- User profile functionality
- Logout functionality

### Blog Management
- Create blog posts
- Edit and delete your own posts
- Save posts as drafts
- Publish blog posts
- View your own blogs through the dashboard
- Display published blogs publicly
- Blog details page

### Discovery and Interface
- Search blogs by title and content
- Filter blogs by category
- Responsive design for mobile, tablet, and desktop
- Dashboard with blog statistics

## Technology Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Development Tools**
- Visual Studio Code
- Postman
- MongoDB Atlas
- Git and GitHub

## Project Structure

```text
CODOMAX/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   └── auth.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog.html
├── profile.html
│
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git
- A modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/Prathamesh0729/CODOMAX.git
```

Navigate to the project directory:

```bash
cd CODOMAX
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=