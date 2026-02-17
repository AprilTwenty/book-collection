import "./BookReviewSection.css";

const MyReviewCard = ({ review, onEdit }) => {
    return (
        <div className="comment-box">

            <div className="review-rating">
                {[1,2,3,4,5].map(star => (
                    <span key={star}>
                        {star <= review.rating ? "★" : "☆"}
                    </span>
                ))}
            </div>

            {review.comment && (
                <div className="review-comment">
                    {review.comment}
                </div>
            )}

            <button onClick={onEdit}>
                แก้ไขรีวิว
            </button>

        </div>
    );
};

export default MyReviewCard;
