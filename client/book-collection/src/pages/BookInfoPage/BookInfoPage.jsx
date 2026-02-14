import BookInfo from '../../components/book/BookInfoComponent/BookInfoComponent.jsx';
import BookReviewSection from '../../components/review/BookReviewSection.jsx';
import './BookInfoPage.css'

function BookInfoPage() {
    
    return (
        <div className="book-info-page">
            <BookInfo />
            <BookReviewSection />
        </div>
    )
}
export default BookInfoPage;