import "./BookCard.css";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-image-wrapper">
        <img src={book.cover_url} alt={book.title} />
      </div>

      <h3 className="book-title">{book.title}</h3>
      <span>⭐</span>
    </div>
    
  );
};

export default BookCard;
