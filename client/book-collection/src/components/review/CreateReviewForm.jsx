import "./BookReviewSection.css";

const CreateReviewForm = ({  
    comment,
    setComment,
    rating,
    setRating,
    submitting,
    handleSubmit
}) => {
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