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
        axios.post(`${apiURL}/api/user/register`, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        })
        .then(response => {
            // handle success, e.g., redirect or show message
            console.log("Registration successful:", response.data);
            navigate("/");
        })
        .catch(error => {
            // handle error, e.g., show error message
            console.error("Registration error:", error.response ? error.response.data : error.message);
        });
        console.log("Form submitted:", formData);
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
