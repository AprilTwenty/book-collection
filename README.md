# 📚 Book Collection

A full-stack web application for managing books, authors, categories, and reviews.

This project was built to practice backend architecture, relational database design, REST API development, and full-stack integration using React, Express, Prisma, and PostgreSQL.

---

## 🚀 Live Demo

### Frontend
[Frontend Demo](https://book-collection-front-end.vercel.app/)

### Backend API
[Backend API](https://book-collection-psi.vercel.app/)

> ⚠️ The backend is hosted on a free-tier server.  
> The first request may take a few seconds due to cold starts.

---

## 🔑 Demo Account

You can test the application using this demo account:

```txt
Username: april
Password: 12345678
```

Or create your own account directly from the website.

---

## ✨ Features

- User authentication system
- Book CRUD operations
- Author and category relationships
- Book review and rating system
- Pagination and query filtering
- RESTful API structure
- Validation middleware
- Relational database design with Prisma ORM

---

## 🛠 Tech Stack

### Frontend
- React
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- PostgreSQL

### Deployment
- Vercel
- Supabase

---

## 📂 Project Structure

```plaintext
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
```

---

## 🔗 API Examples

### Get all books

```http
GET /books
```

### Get book by ID

```http
GET /books/:bookId
```

### Create new review

```http
POST /reviews
```

---

## ⚙️ Local Installation

### 1. Clone Repository

```bash
git clone https://github.com/AprilTwenty/book-collection.git
```

### 2. Install Backend

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create `.env` file inside `/server`

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run Backend

```bash
npm run dev
```

### 6. Install Frontend

```bash
cd ../client
npm install
```

### 7. Run Frontend

```bash
npm run dev
```

---

## 📌 Future Improvements

- Image upload support
- Search and sorting system
- Role-based authorization
- Unit testing
- Docker support
- API documentation improvements

---

## 👨‍💻 Author

GitHub:  
https://github.com/AprilTwenty