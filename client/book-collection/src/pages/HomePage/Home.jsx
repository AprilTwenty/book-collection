import "./Home.css";
import heroImgBack from "../../assets/images/homepage/a-book-2304389_1280.jpg";
import heroImgFront from "../../assets/images/homepage/library-488690_1280.jpg";
import { getBooks, getLatestBooks } from "../../api/books.js";
import BookSlider from "../../components/layout/SliderBook/SliderBooks.jsx";
import PopularBooks from "../../components/book/PopularBooks/PopularBooks.jsx";
import BookCard from "../../components/book/BookCard/BookCard.jsx";
import React, { useEffect, useState } from "react";

function HomePage() {

  const [books, setBooks] = useState([]);
  const [ popularBooks, setPopularBooks ] = useState([]);
  const [ latestBooks, setLatestBooks ] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


useEffect(() => {
  async function fetchBook() {
    try {
      setIsLoading(true);
      const latestRes = await getLatestBooks(5);
      const response = await getBooks({
        page: 1,
        limit: 6
      });
      const popularRes = await getBooks({
        sort: "rating",
        order: "desc",
        page: 1,
        limit: 5
      });
      const allRes = await getBooks({
        page: currentPage,
        limit: 12
      });

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
      if (allRes.data?.success) {
        const total = allRes.data.total ?? allRes.data.data.length;
        console.log("ALL RES:", allRes.data);

        setAllBooks(allRes.data.data);
        setTotalPages(Math.ceil(total / 12));
      }

    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  }

  fetchBook();
}, [currentPage]);

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
        <PopularBooks books={books} />
      </section>

      {/* ALL BOOKS SECTION */}
      <section className="all-books-section">
        <h2>All Books</h2>

        <div className="book-grid">
          { isLoading ? (
            <p>กำลังโหลดหนังสือ...</p>
          ) : (
            allBooks.map(book => (
              <BookCard key={book.book_id} book={book} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              disabled={isLoading}
              className={currentPage === index + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>

    </main>
  );
}

export default HomePage;
