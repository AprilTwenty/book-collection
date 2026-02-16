import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookReviewSection.css";
import { getReviewById, getReviewsByBookId } from "../../api/reviews";

function BookReviewSection() {
    const { id } = useParams();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true);
                const response = await getReviewsByBookId(id);
                /*
                const response = await axios.get(
                    `http://localhost:3000/reviews?book_id=${id}`,
                    {
                        withCredentials: true
                    }
                );
                */

                if (response.data.success) {
                    setReviews(response.data.data);
                } else {
                    setError("ไม่พบรีวิว");
                }

            } catch (err) {
                console.error(err);
                setError("โหลดรีวิวไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, [id]);

    if (loading) return <div className="review-box">กำลังโหลดรีวิว...</div>;
    if (error) return <div className="review-box">{error}</div>;

    return (
        <div className="review-section">
            <div className="review-box">
                <h2>ความคิดเห็นผู้อ่าน</h2>

                {reviews.length === 0 ? (
                    <p>ยังไม่มีรีวิวสำหรับหนังสือเล่มนี้</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.review_id} className="review-card">

                            <div className="review-header">
                                <strong>{review.users?.username}</strong>
                                <span>⭐ {review.rating}</span>
                            </div>

                            {review.comment && (
                                <div className="review-comment">
                                    {review.comment}
                                </div>
                            )}

                            <div className="review-date">
                                {new Date(review.created_at).toLocaleDateString("th-TH", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </div>

                        </div>
                    ))
                )}
            </div>
            <form className="comment-box">
                <textarea
                    placeholder="เขียนรีวิวที่นี่..."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />
                {[1,2,3,4,5].map(star => (
                    <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{
                        cursor: "pointer",
                        fontSize: "24px"
                        }}
                    >
                        {star <= rating ? "⭐" : "☆"}
                    </span>
                ))}
                <button type="submit">ยืนยัน</button>
            </form>
        </div>
    );
}

export default BookReviewSection;
