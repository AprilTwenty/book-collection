import { login } from "../apis/login";
import React, { use, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/ContentComponent.css";

function LoginComponent() {
    const navigate = useNavigate();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        const clientData = {};
        clientData.body = {
            "username": username,
            "password": password
        };

        try {
            const response = await login(clientData);
            if (response.data && response.data.success) {
                setError("");
                setSuccess(true)

            } else {
                const message = response.data?.message || "เกิดข้อผิดพลาดในการ Login";
                setError(message)
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "เกิดข้อผิดพลาดในการ Login"
            setError(message);
        }
    }

    return (
        <div className="content-contrainer">
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
                    <button type="submit">Login</button>
                    <div>สมัครสมาชิกใหม่<Link to='/auth/register'>Register</Link></div>
                </div>
            </form>
        </div>
    )
}

export default LoginComponent;