import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookReviewSection.css";
import { getReviewById, getReviewsByBookId, createReview } from "../../api/reviews";

function BookReviewSection() {
    const { id } = useParams();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    

    const handleCreateReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        setError(null);
        const clientData = {
            comment,
            rating,
            "book_id": id
        };

        try {
            const response = await createReview(clientData);
            if (response.data?.success) {
                const newReview = response.data.data;
                setReviews(prev => [newReview, ...prev]);
                setComment("");
                setRating(5);
            }
        } catch(error) {
            setError("create review failed");
        } finally {
            setSubmitting(false);
        }
    }

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
                                <img
                                    className="profile-img"
                                    src={
                                        review.user_profile?.avatar_url || "/avatar-default.png"
                                    }
                                    alt="profile"
                                />

                                <div className="review-user">
                                    <strong>{review.users?.username}</strong>

                                    <div className="review-rating">
                                        {[1,2,3,4,5].map(star => (
                                            <span key={star}>
                                                {star <= review.rating ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
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
            <form className="comment-box" onSubmit={handleCreateReview} >
                <textarea
                    placeholder="เขียนรีวิวที่นี่..."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />
                <div className="rating-select">
                    {[1,2,3,4,5].map(star => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={star <= rating ? "active" : ""}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "กำลังส่ง..." : "ยืนยัน"}
                </button>
            </form>
        </div>
    );
}

export default BookReviewSection;
