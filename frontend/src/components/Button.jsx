import React from "react";
import styles from '../css/Button.module.css';

const Button = ({ onClick, children, variant = 'primary', className = '', ...props }) => {
    const buttonClass = `${styles.button} ${styles[variant]} ${className}`.trim();
    
    return (
        <button className={buttonClass} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

export default Button;