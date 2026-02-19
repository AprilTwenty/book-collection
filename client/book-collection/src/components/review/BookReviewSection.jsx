import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookReviewSection.css";
import { getReviewsByBookId, createReview, updateReview } from "../../api/reviews";
import CreateReviewForm from "./CreateReviewForm.jsx";
import MyReviewCard from "./MyReviewCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function BookReviewSection() {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();



    const [myReview, setMyReview] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState(null);
    const [editing, setEditing ]= useState(false);
    const [submitting, setSubmitting] = useState(false);


    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);
        setError(null);
        const clientData = {
            comment,
            rating,
            book_id: id
        };
        try {
            let response;
            if (myReview) {
            // UPDATE
            response = await updateReview(myReview.review_id, clientData);
            const updatedReview = response.data.data;
            setReviews(prev =>
                prev.map(r =>
                r.review_id === updatedReview.review_id
                    ? updatedReview
                    : r
                )
            );
            setMyReview(updatedReview);
            } else {
            // CREATE
            response = await createReview(clientData);
            const newReview = response.data.data;
            setReviews(prev => [newReview, ...prev]);
            setComment("");
            setRating(5);
            setMyReview(newReview);

            }
        } catch {
            setError("submit review failed");
        } finally {
            setSubmitting(false);
            setEditing(false);

        }
    };
    /*
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
    */

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true);
                const response = await getReviewsByBookId(id);
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
    useEffect(() => {
        if (!user?.user_id) return;

        const found = reviews.find(
            r => r.user_id === user.user_id
        );
        setMyReview(found ?? null);
    }, [reviews, user]);

    if (loading || authLoading) return <div className="review-box">กำลังโหลดรีวิว...</div>;

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
                                        review.users?.user_profile?.avatar_url || "/avatar-default.png"
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
            {(!myReview || editing) ? (
                <CreateReviewForm
                    comment={comment}
                    setComment={setComment}
                    rating={rating}
                    setRating={setRating}
                    submitting={submitting}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <MyReviewCard
                    review={myReview}
                    onEdit={() => setEditing(true)}
                />
            )}
            {/*}
            <form className="comment-box" onSubmit={handleSubmit} >
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

                <button>
                    {myReview ? "Update Review" : "Create Review"}
                </button>
            </form>
            {*/}
        </div>
    );
}

export default BookReviewSection;
