import React, { useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import styles from "../css/pages_css/register.module.css";
import axios from "axios";

const Register = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const res = axios.post(`${apiURL}/api/user/register`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            const data = res.data;
            if (data.error) {
                // handle error, e.g., show message
                console.error("Registration error:", data);
            } else {
                console.log("Registration successful:", data);
                navigate("/", {state: res.data});
            }
        }
        catch (error) {
            // handle network or server error
            // Example: setError("An error occurred. Please try again.");
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <div className={styles.logo}>✔</div>
                <h1 className={styles.brand}>Pomofocus</h1>
                <p className={styles.subtitle}>Create Account</p>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>NAME</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
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
                        Sign up with Email
                    </button>
                </form>
                <p className={styles.registerText}>
                    Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
