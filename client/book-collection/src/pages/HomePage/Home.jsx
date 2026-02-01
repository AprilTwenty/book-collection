import "./Home.css";
import heroImgBack from "../../assets/images/homepage/a-book-2304389_1280.jpg";
import heroImgFront from "../../assets/images/homepage/library-488690_1280.jpg";
import { getBooks, getLatestBooks } from "../../api/books.js";
import BookSlider from "../../components/layout/SliderBook/SliderBooks.jsx";
import PopularBooks from "../../components/book/PopularBooks/PopularBooks.jsx";
import React, { useEffect, useState } from "react";

function HomePage() {

  const [books, setBooks] = useState([]);
  const [ popularBooks, setPopularBooks ] = useState([]);
  const [ latestBooks, setLatestBooks ] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  async function fetchBook() {
    try {
      const latestRes = await getLatestBooks(10);
      const response = await getBooks("?page=1&limit=10");

      const popularRes = await getBooks(
        "?sort=rating&order=desc&page=1&limit=5"
      );
      if (latestRes.data?.success) {
        setLatestBooks(latestRes.data.data);
      } else {
        setError("รูปแบบข้อมูลไม่ถูกต้อง");
      }
      if (response.data?.success) {
        setBooks(response.data.data);
      } else {
        setError("รูปแบบข้อมูลไม่ถูกต้อง");
      }

      if (popularRes.data?.success) {
        setPopularBooks(popularRes.data.data);
      } else {
        setError("รูปแบบข้อมูลไม่ถูกต้อง");
      }

    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
  }

  fetchBook();
}, []);

  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-img-box">
          <img 
            src={heroImgFront} 
            alt="hero-img" 
            className="hero-img img-front" 
          />
          <img 
            src={heroImgBack} 
            alt="hero-img" 
            className="hero-img img-back" 
          />
        </div>

        <div className="info-card">
          <div className="slider-box">
            <BookSlider books={latestBooks} />
          </div>
        </div>
      </section>

      {/* POPULAR BOOKS SECTION */}
      <section className="popular-section">
        <PopularBooks books={popularBooks} />
      </section>

    </main>
  );
}

export default HomePage;
