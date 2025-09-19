import React, { useState } from "react";
import { register } from "../apis/register";
import { useNavigate  } from "react-router-dom";
import "./css/ContentComponent.css";
import { Link } from "react-router-dom";

function RegisterComponent() {
    const navigate = useNavigate();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            return setError("รหัสผ่านไม่ตรงกัน")
        }
        const clientData = {}
        clientData.body = {
            "username": username,
            "password": password,
            "email": email
        }
        try {
            const response = await register(clientData);
            if (response.data && response.data.success) {
                setSuccess(true);
                setError("");
                navigate("/auth/login");
            } else {
                console.log(response.data.message)
                const message = response.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน";
                setError(message);
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน"
            setError(message)
        }
    }

    return (
        
        <div className="content-contrainer">
            <h1>Register</h1>
            {error && error != "รหัสผ่านไม่ตรงกัน" && <div className="error-message">*{error}</div>}
            {success && <div className="success-message">ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ</div>}
            <form onSubmit={handleRegister}>
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
                    <div className="input-box">
                        <label>Confirm password:</label>
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    {error==="รหัสผ่านไม่ตรงกัน" && (
                            <div className="error-message">*{error}</div>
                    )}
                    <div className="input-box">
                        <label>Email:</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <button type="submit">Register</button>
                    <div>หากมีบัญชีผู้ใช้แล้ว คุณสามารถ <Link to='/auth/login'>เข้าสู่ระบบ</Link></div>
                </div>
            </form>
        </div>
    )
}

export default RegisterComponent;