import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import GreenCorner from './components/corner-background.jsx'
import HomePage from './pages/Home.jsx'
import HeaderNavBar from './components/HeaderNavBar/HeaderNavBar.jsx';
import BookInfoPage from './pages/BookInfoPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext";


function App() {
  const { isLogin } = useAuth();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BrowserRouter>
        <GreenCorner />
        <HeaderNavBar />
        <Routes>
          <Route path='/' element={ <HomePage /> } /> 
          <Route path='/books/:id' element={ <ProtectedRoute><BookInfoPage /></ProtectedRoute> } />
          <Route path='/auth/register' element={ <RegisterPage /> } />
          <Route path="/auth/login" element={ isLogin ? <Navigate to="/" replace /> : <LoginPage /> } />
        </Routes>
      </BrowserRouter>
    </div>
    
  )
}


export default App
