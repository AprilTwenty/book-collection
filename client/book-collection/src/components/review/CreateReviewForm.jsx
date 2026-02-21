import "./BookReviewSection.css";
import { useEffect, useState } from "react";

const CreateReviewForm = ({  
    comment,
    setComment,
    rating,
    setRating,
    submitting,
    myReview,
    handleSubmit
}) => {
    useEffect(() => {
        setComment(myReview?.comment ?? "");
        setRating(myReview?.rating ?? 5)
    }, [myReview]);
    return (
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

                <button type="submit" disabled={submitting}>
                    {submitting ? "กำลังส่ง..." : "ยืนยัน"}
                </button>

            </form>
    );
};

export default CreateReviewForm;