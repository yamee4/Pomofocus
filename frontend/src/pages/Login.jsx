import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <div style={styles.logo}>✔</div>
                <h1 style={styles.brand}>Pomofocus</h1>
                <p style={styles.subtitle}>Log in to your account</p>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>PASSWORD</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Your password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Log in
                    </button>
                </form>
                <p style={styles.registerText}>
                    Don’t have an account? <Link to="/register" style={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#BA4949",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
    },
    logoContainer: {
        textAlign: "center",
        marginBottom: "1.5rem",
    },
    logo: {
        fontSize: "2.5rem",
        color: "white",
    },
    brand: {
        color: "white",
        fontSize: "1.8rem",
        fontWeight: "bold",
        margin: 0,
    },
    subtitle: {
        color: "white",
        fontWeight: 600,
        fontSize: "1rem",
        marginTop: "0.25rem",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "2rem",
        width: "100%",
        maxWidth: "350px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "1rem",
    },
    label: {
        fontSize: "0.75rem",
        fontWeight: "bold",
        color: "#666",
        marginBottom: "0.3rem",
        display: "block",
        textTransform: "uppercase",
    },
    input: {
        padding: "0.8rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        width: "100%",
        backgroundColor: "#f5f5f5",
    },
    button: {
        marginTop: "1rem",
        padding: "0.9rem",
        backgroundColor: "#333333",
        color: "#ffffff",
        fontSize: "1rem",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background 0.3s",
    },
    registerText: {
        textAlign: "center",
        marginTop: "1.5rem",
        fontSize: "0.9rem",
        color: "#555",
    },
    link: {
        color: "#333",
        textDecoration: "underline",
        marginLeft: "0.25rem",
    },
};

export default Login;
