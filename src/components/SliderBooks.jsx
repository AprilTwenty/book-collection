import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { getBooks } from "../apis/books";
import noImg from "./images/No_Image_Available.jpg";

function BookSlider({ books }) {
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
                {books.map((book) => {
                    return (
                        <div key={book.book_id} className="slider-item">
                            <Link to={`/books/${book.book_id}`}>
                                <img src={book.cover_url} alt={book.title} className="book-cover" onError={(e) => {e.currentTarget.src = noImg}} />
                            {book.title}
                            </Link>
                        </div>
                    );
                })}
            </Slider>
        </section>
    )
}
export default BookSlider;