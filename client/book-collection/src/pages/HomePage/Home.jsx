import "./Home.css";
import heroImgBack from "../../assets/images/homepage/a-book-2304389_1280.jpg";
import heroImgFront from "../../assets/images/homepage/library-488690_1280.jpg";
import { getBooks } from "../../api/books.js";
import BookSlider from "../../components/layout/SliderBook/SliderBooks.jsx";
import PopularBooks from "../../components/book/PopularBooks/PopularBooks.jsx";
import React, { useEffect, useState } from "react";

function HomePage() {

  const [books, setBooks] = useState([]);
  const [ popularBook, setPopularBook ] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const clientData = {
          params: "",
          query: "?page=1&&limit=10"
        };

        const response = await getBooks(clientData);

        const popularClientData = {
          params: "",
          query: "?sort=rating&order=desc&&page=1&&limit=5"
        };

        const popularRes = await getBooks(popularClientData);

        if (response.data && response.data.success) {
          setBooks(response.data.data);
        } else {
          setError("รูปแบบข้อมูลไม่ถูกต้อง");
        }

        if (response.data && response.data.success) {
          setPopularBook(popularRes.data.data);
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
            <BookSlider books={books} />
          </div>
        </div>
      </section>

      {/* POPULAR BOOKS SECTION */}
      <section className="popular-section">
        <PopularBooks books={popularBook} />
      </section>

    </main>
  );
}

export default HomePage;
