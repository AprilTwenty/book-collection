import "./Home.css";
import heroImgBack from "../../assets/images/homepage/a-book-2304389_1280.jpg";
import heroImgFront from "../../assets/images/homepage/library-488690_1280.jpg"
import { getBooks } from "../../api/books.js";
import BookSlider from "../../components/layout/SliderBook/SliderBooks.jsx";
import axios from "axios";
import React, { useEffect, useState } from "react";


function HomePage() {

    const [ books, setBooks ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        async function fetchBook() {
            try {
              const clientData = {};
              clientData.params = ""
              clientData.query = "?page=1&&limit=10";
                const response = await getBooks(clientData);

                if (response.data && response.data.success) {
                    setBooks(response.data.data);
                } else {
                    setError("รูปแบบข้อมูลไม่ถูกต้อง")
                }
            } catch (error) {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            }
        }
        fetchBook()
    }, []);

    return (
      <section className="hero-section">
        <div className="hero-img-box">
          <img src={heroImgFront} alt="hero-img" className="hero-img img-front" />
          <img src={heroImgBack} alt="hero-img" className="hero-img img-back" />
        </div>
        <div className="info-card">
          <div className="slider-box">
            <BookSlider books={books} />
          </div>
        </div>
      </section>
    );
}

export default HomePage;