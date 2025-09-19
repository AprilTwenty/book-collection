import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './css/header-nav-bar.css';

function HeaderNavBar() {
    const [ search, setSearch ] = useState('');
    return (
        <div className="header-nav-bar">
            <div className="logo">
                <img src="https://www.shutterstock.com/shutterstock/photos/735805411/display_1500/stock-vector-creative-book-logo-design-735805411.jpg" alt="logo-website"></img>
            </div>
            <nav>
                <Link to={"/"}>HOME</Link>
                <Link to={"/books"}>Books</Link>
                <Link to={"/categories"}>Categories</Link>
                <Link to={"/aurhors"}>Authors</Link>
            </nav>
            <div className="nav-search">
                <input 
                    type="text" 
                    className="search" 
                    size={10}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Link to={`/books?search=${encodeURIComponent(search)}`}>
                    <div className="search-icon">🔎</div>
                </Link>
            </div>
            <div className="login">
                <Link to={`/auth/login`}>
                    <div className="nav-auth">
                        Login
                    </div>
                </Link>
                </div>
                <div className="nav-profile">
                <div className="profile-img">

                </div>
            </div>
        </div>
    );
}
export default HeaderNavBar;