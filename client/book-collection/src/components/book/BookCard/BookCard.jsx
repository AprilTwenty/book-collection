import "./BookCard.css";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book.book_id}`} className="book-card">
      <div className="book-image-wrapper">
        
        <img src={book.cover_url} alt={book.title} />
        
      </div>

      <h3 className="book-title">{book.title}</h3>
      <span>⭐ {book.rating?.toFixed(1) || 0}</span>
    </Link>
    
  );
};

export default BookCard;
