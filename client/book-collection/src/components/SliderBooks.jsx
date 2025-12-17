import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import noImg from "./images/No_Image_Available.jpg";

function BookSlider({ books }) {
  if (!books || books.length === 0) {
    return <div>ไม่พบหนังสือที่จะแสดง</div>;
  }

  return (
    <section className="book-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        centeredSlides={true}
        navigation={true}
        pagination={{ clickable: true }}
        spaceBetween={20}
        loop={true}   
      >
        {books.map((book) => (
          <SwiperSlide key={book.book_id}>
            <div className="slide-item">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default BookSlider;
