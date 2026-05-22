# 📚 Book Collection

A full-stack web application for managing books, authors, categories, and reviews.

This project was built to practice backend architecture, relational database design, REST API development, and full-stack integration using React, Express, Prisma, and PostgreSQL.

---

## 🚀 Live Demo

### Frontend
https://book-collection-front-end.vercel.app/

### Backend API
https://book-collection-psi.vercel.app/

> ⚠️ The backend is hosted on a free-tier server.  
> The first request may take a few seconds due to cold starts.

---

## 🔑 Demo Account

You can test the application using this demo account:

Username: april
Password: 12345678

Or create your own account directly from the website.

✨ Features
  - User authentication system
  - Book CRUD operations
  - Author and category relationships
  - Book review and rating system
  - Pagination and query filtering
  - RESTful API structure
  - Validation middleware
  - Relational database design with Prisma ORM

🛠 Tech Stack
Frontend
  - React
  - Axios
  - React Router
Backend
  - Node.js
  - Express.js
  - Prisma ORM
Database
  - PostgreSQL
Deployment
  - Vercel
  - Supabase

📂 Project Structure

book-collection/
├── client/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── server/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── utils/
│   └── ...
│
└── README.md

🔗 API Examples
Get all books
  GET /books
Get book by ID
  GET /books/:bookId
Create new review
  POST /reviews

⚙️ Local Installation
1. Clone Repository
  git clone https://github.com/AprilTwenty/book-collection.git
2. Install Backend
  cd server
  npm install
3. Configure Environment Variables
Create .env file inside /server
  DATABASE_URL=your_database_url
  SECRET_KEY=your_secret_key
4. Prisma Setup
  npx prisma generate
  npx prisma migrate dev
5. Run Backend
  npm run dev
6. Install Frontend
  cd ../client
  npm install
7. Run Frontend
  npm run dev


📌 Future Improvements
  - Image upload support
  - Search and sorting system
  - Role-based authorization
  - Unit testing
  - Docker support
  - API documentation improvements

👨‍💻 Author
GitHub:
  https://github.com/AprilTwenty