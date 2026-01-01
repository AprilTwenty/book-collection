import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import './HeaderNavBar.css'
import { useEffect, useRef } from 'react';
import { useAuth } from "../../context/AuthContext";


function HeaderNavBar() {
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isLogin, logout, user } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsProfileOpen(false);
        setIsLogin(false);
        navigate("/auth/login");
    };

    useEffect(() => {
        setIsProfileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [ search, setSearch ] = useState('');
    const [ isProfileOpen, setIsProfileOpen ] = useState(false);
    return (
        <div className="header-nav">
            <div className="nav-logo">
                <img src="https://www.shutterstock.com/shutterstock/photos/735805411/display_1500/stock-vector-creative-book-logo-design-735805411.jpg" alt="logo-website"></img>
            </div>
            <div className='nav-menu'>
                <Link to={"/"}>HOME</Link>
                <Link to={"/books"}>Books</Link>
                <Link to={"/categories"}>Categories</Link>
                <Link to={"/aurhors"}>Authors</Link>
            </div>
            <div className='nav-actions'>
                <div className="nav-search">
                    <input 
                        type="text" 
                        className="nav-search__input" 
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Link 
                        to={`/books?search=${encodeURIComponent(search)}`}
                        className="nav-search__btn"
                        >
                        🔎
                    </Link>
                </div>
                <div className="nav-login">
                    {isLogin ? (
                        <button onClick={logout} className='nav-auth' >Logout</button>
                    ) : (
                        <button onClick={() => navigate('/auth/login')} className='nav-auth' >Login</button>
                    )}
                </div>
                {isLogin && (
                <div className="nav-profile" ref={profileRef}>
                    <button className="nav-profile-btn"
                        onClick={() => setIsProfileOpen(prev => !prev)}
                        aria-haspopup="true"
                        aria-expanded={isProfileOpen}
                    >
                        <img className="nav-profile-img" src="/default-avatar-image.png"alt="profile" />
                    </button>
                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <Link to="/profile" className="profile-dropdown__item">
                                Profile
                            </Link>
                            <Link to="/settings" className="profile-dropdown__item">
                                Settings
                            </Link>
                            <button className="profile-dropdown__item logout"
                             onClick={logout}
                             >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}
export default HeaderNavBar;