import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBooks } from "../../api/books";
import BookCard from "../../components/book/BookCard/BookCard.jsx";
import "./BooksPage.css";

function BooksPage() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);

  const name = searchParams.get("name");

useEffect(() => {
  async function fetchBooks() {
    try {
      const response = await getBooks({
        name: name || "",
      });
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  fetchBooks();
}, [name]);

  return (
    <div className="books-container">
      {books.length === 0 ? (
        <h2>ไม่พบหนังสือสำหรับ "{name}"</h2>
      ) : (
        books.map(book => (
          <BookCard key={book.book_id} book={book} />
        ))
      )}
    </div>
  );
}

export default BooksPage;