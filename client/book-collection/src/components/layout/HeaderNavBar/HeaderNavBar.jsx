import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import './HeaderNavBar.css'
import { useEffect, useRef } from 'react';
import { useAuth } from "../../../context/AuthContext";


function HeaderNavBar() {
    const profileRef = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, profile, isLogin, logout } = useAuth();
    const [ search, setSearch ] = useState('');
    const [ isProfileOpen, setIsProfileOpen ] = useState(false);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        navigate("/auth/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setIsMenuOpen(false);
        navigate(`/books?name=${encodeURIComponent(search)}`);
    };

    useEffect(() => {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
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

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current && 
                !menuRef.current.contains(e.target) &&
                !e.target.closest('.nav-mobile-menu')
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="header-nav">
            <div className="nav-logo">
                <img src="https://www.shutterstock.com/shutterstock/photos/735805411/display_1500/stock-vector-creative-book-logo-design-735805411.jpg" alt="logo-website"></img>
            </div>

            {/* Desktop menu */}
            <div className='nav-menu'>
                <Link to={"/"}>HOME</Link>
                <Link to={"/books"}>Books</Link>
                <Link to={"/categories"}>Categories</Link>
                <Link to={"/aurhors"}>Authors</Link>
            </div>

            <div className='nav-actions'>
                <form onSubmit={handleSearch} className="nav-search">
                    <input 
                        type="text" 
                        className="nav-search__input" 
                        placeholder={"Search books..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="nav-search__btn">🔎</button>
                </form>

                <div className="nav-login">
                    {isLogin ? (
                        <button onClick={handleLogout} className='nav-auth'>Logout</button>
                    ) : (
                        <button onClick={() => navigate('/auth/login')} className='nav-auth'>Login</button>
                    )}
                </div>

                {isLogin && (
                    <div className="nav-profile" ref={profileRef}>
                        <button className="nav-profile-btn"
                            onClick={() => {
                                setIsProfileOpen(prev => !prev)
                                setIsMenuOpen(false);
                                }
                            }
                            aria-haspopup="true"
                            aria-expanded={isProfileOpen}
                        >
                            <img
                                className="nav-profile-img"
                                src={loading ? "/avatar-default.png" : profile?.avatar_url || "/avatar-default.png"}
                                alt="profile"
                            />
                        </button>
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <Link to="/profile" className="profile-dropdown__item">Profile</Link>
                                <Link to="/settings" className="profile-dropdown__item">Settings</Link>
                                <button className="profile-dropdown__item logout" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            
                <div ref={menuRef} style={{position: 'relative'}}>
                    <button 
                        className="nav-hamburger"
                        onClick={() => {
                            setIsMenuOpen(prev => !prev);
                            setIsProfileOpen(false);
                        }}
                        aria-label="toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile dropdown menu - ย้ายมาอยู่นอก wrapper */}
                {isMenuOpen && (
                    <div className="nav-mobile-menu">
                        <Link to={"/"}>HOME</Link>
                        <Link to={"/books"}>Books</Link>
                        <Link to={"/categories"}>Categories</Link>
                        <Link to={"/aurhors"}>Authors</Link>
                        {!isLogin && (
                            <Link to={"/auth/login"}>Login</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default HeaderNavBar;