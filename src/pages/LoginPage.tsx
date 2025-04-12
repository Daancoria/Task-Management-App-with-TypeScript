import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome!</h1>
      <p className={styles.subtext}>Please log in to access your tasks.</p>
      <button onClick={() => loginWithRedirect()} className={styles.button}>
        🔐 Log In
      </button>
    </div>
  );
};

export default LoginPage;
