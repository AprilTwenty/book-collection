import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { getBooks } from "../apis/books";
import noImg from "./images/No_Image_Available.jpg";

function BookSliderOld({ books }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    if (!books || books.length === 0) {
    console.log("books ไม่ใช่อาร์เรย์หรือไม่มีข้อมูล:", books);
    return <div>ไม่พบหนังสือที่จะแสดง</div>;
    }

   
    return (
        <section className="book-slider">
      <Slider {...settings}>
        {books.map((book) => (
          <div key={book.book_id}>
            {/* ⭐ สำคัญ: layout wrapper */}
            <div className="slide-inner">
              <Link to={`/books/${book.book_id}`}>
                <img
                  src={book.cover_url}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = noImg;
                  }}
                />
                <p className="book-title">{book.title}</p>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </section>
    )
}
export default BookSliderOld;