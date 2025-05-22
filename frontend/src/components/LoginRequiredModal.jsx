import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/LoginRequiredModal.module.css";

const LoginRequiredModal = ({ onClose }) => {
   const navigate = useNavigate();

   return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Login Required</h2>
        <p>You need to sign in to perform this action.</p>
        <div className={styles.actions}>
          <button onClick={() => navigate("/login")} className={styles.loginBtn}>
            Sign In
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;