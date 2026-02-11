import BookCard from "../BookCard/BookCard.jsx";
import "./PopularBooks.css";

const PopularBooks = ({ books }) => {
    if (!books || books.length === 0) {
        return <div>ไม่พบหนังสือที่จะแสดง</div>;
    }
    return (
        <section className="popular-section">
        <h2>Popular Books</h2>
        <div className="book-grid">
            {books.map(book => (
            <BookCard key={book.book_id} book={book} />
            ))}
        </div>
        </section>
    );
};

export default PopularBooks;
