import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
//import GreenCorner from './components/layout/Corner-Background/corner-background.jsx'
import HomePage from './pages/HomePage/Home.jsx'
import HeaderNavBar from './components/layout/HeaderNavBar/HeaderNavBar.jsx';
import BookInfoPage from './pages/BookInfoPage/BookInfoPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import BooksPage from "./pages/BooksPage/BooksPage.jsx";
import { useAuth } from "./context/AuthContext";


function App() {
  const { isLogin } = useAuth();

  return (
    <div className="app-wrapper">
      <BrowserRouter>
        {/*<GreenCorner /> */}
        <HeaderNavBar />
        <Routes>
          <Route path='/' element={ <HomePage /> } /> 
          <Route path='/books/:id' element={ <ProtectedRoute><BookInfoPage /></ProtectedRoute> } />
          <Route path="/books" element={<BooksPage />} />
          <Route path='/auth/register' element={ <RegisterPage /> } />
          <Route path="/auth/login" element={ isLogin ? <Navigate to="/" replace /> : <LoginPage /> } />
        </Routes>
      </BrowserRouter>
    </div>
    
  )
}


export default App
