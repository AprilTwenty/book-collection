import "./BookCard.css";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-image-wrapper">
        <Link to={`/books/${book.book_id}`}>
        <img src={book.cover_url} alt={book.title} />
        </Link>
      </div>

      <h3 className="book-title">{book.title}</h3>
      <span>⭐</span>
    </div>
    
  );
};

export default BookCard;
