import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/LoginPage.module.css';

// LoginPage component
const LoginPage: React.FC = () => {
  // Destructure the loginWithRedirect function from the Auth0 hook
  const { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.container}>
      {/* Page heading */}
      <h1 className={styles.heading}>Welcome!</h1>
      
      {/* Subtext prompting the user to log in */}
      <p className={styles.subtext}>Please log in to access your tasks.</p>
      
      {/* Log in button that triggers the Auth0 login flow */}
      <button onClick={() => loginWithRedirect()} className={styles.button}>
        🔐 Log In
      </button>
    </div>
  );
};

export default LoginPage;
