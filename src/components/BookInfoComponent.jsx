import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getBooks } from '../apis/books';
import './css/BookInfo.css'
import { useParams } from 'react-router-dom';
import noImg from "../images/No_Image_Available.jpg";
import { Link } from "react-router-dom";

function BookInfo() {
    const [ book, setBook ] = useState(null);
    const [ error, setError ] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchBook() {
            const clientData = {};
            clientData.query = "";
            clientData.params = "/" + id;
            try {
                const response = await getBooks(clientData);
                if (response.data && response.data.success) {
                    setBook(response.data.data);
                } else {
                    setError("ไม่พบข้อมูล");
                }
            } catch (error) {
                console.error(error);
                setError(("พบข้อผิดพลาด"));
            }
        }
        fetchBook();
    }, [id])

    if (!book) return <div>กำลังโหลดข้อมูล...</div>
    if (error) return <div>{error}</div>
    return (
        <div className="book-info-box">
            <div className='book-detail-box'>
                <div className='book-img'>
                    <img src={book.cover_url} alt="hero-img" onError={(e) => { e.currentTarget.src=noImg }}/>
                </div>
                <div className='book-detail'>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>ชื่อหนังสือ: </div>
                        <div>{book.title}</div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>ISBN: </div>
                        <div>{book.isbn}</div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>Publisher: </div>
                        <div>{book.publisher}</div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>วันที่ตีพิมพ์: </div>
                        <div>{book.published_year}</div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>วันที่ลงข้อมูล: </div>
                        <div>{new Date(book.created_at).toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}</div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>แก้ไขล่าสุด: </div>
                        <div>{new Date(book.updated_at).toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}</div>
                    </div>      
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>หมวดหมู่: </div>
                        <div className='book-detail-info'>
                        {
                            book.category.map((category, index) => {
                                return (
                                    <Link to={`/books?category=${category}`}>
                                        <div key={index} className='detail-item'>{category}</div>
                                    </Link>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>ผู้เขียน: </div>
                        <div className='book-detail-info'>
                        {
                            book.author.map((author, index) => {
                                return (
                                    <Link to={`/books?author=${author}`} >
                                        <div key={index} className='detail-item'>{author}</div>
                                    </Link>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div className='book-detail-title'>
                        <div className='book-detail-label'>รายละเอียด: </div>
                        <div>{book.description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BookInfo;