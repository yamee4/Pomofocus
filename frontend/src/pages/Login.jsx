import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../css/pages_css/login.module.css";
import axios from "axios";


const Login = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiURL}/api/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = res.data;
            if (data.error === "Invalid credentials") {
                // handle error, e.g., show message
                console.error("Login error:", data);
            } else {
                console.log("Login successful:", data);
                navigate(location.state?.from || "/");
            }
        } catch (error) {
            // handle network or server error
            // Example: setError("An error occurred. Please try again.");
            console.error("An error occurred:", error);
        }
        console.log("Form submitted:", formData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>✔</div>
                <h1 className={styles.brand}>Pomofocus</h1>
                <p className={styles.subtitle}>Log in to your account</p>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>PASSWORD</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Your password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        Log in
                    </button>
                </form>
                <p className={styles.registerText}>
                    Don’t have an account? <Link to="/register" className={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};


export default Login;
