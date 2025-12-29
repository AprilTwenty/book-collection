import { login as loginApi } from "../apis/login";
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/ContentComponent.css";
import { useAuth } from "../context/AuthContext";


function LoginComponent() {
    const navigate = useNavigate();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const clientData = {
            body: {
                username,
                password
            }
        };
        try {
            const response = await loginApi(clientData);
            if (response.data && response.data.success) {
                login(response.data.token, response.data.user);
                navigate(from, { replace: true });
                return;
            } else {
                const message = response.data?.message || "เกิดข้อผิดพลาดในการ Login";
                setError(message)
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "เกิดข้อผิดพลาดในการ Login"
            setError(message);
                setLoading(false);
        }
    }

    return (
        <div className="content-container">
            <h1>Login</h1>
            {error && <div className="error-message">*{error}</div>}
            {success && <div className="success-message">การ Login เสร็จสมบูรณ์</div>}
            <form onSubmit={(handleLogin)} >
                <div className="input-wrapper">
                    <div className="input-box">
                        <label>Username:</label>
                        <input 
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <label>Password:</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                    <div>สมัครสมาชิกใหม่<Link to='/auth/register'>Register</Link></div>
                </div>
            </form>
        </div>
    )
}

export default LoginComponent;