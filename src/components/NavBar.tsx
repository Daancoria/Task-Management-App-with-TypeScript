import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/NavBar.module.css';
import { useDarkMode } from '../hooks/useDarkMode';

const NavBar: React.FC = () => {
  // Destructure logout and user from Auth0 hook
  const { logout, user } = useAuth0();

  // Use custom hook to manage dark mode state and toggle function
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <nav className={styles.navbar}>
      {/* Left section of the navbar */}
      <div className={styles.left}>
        {/* Logo with a link to the home page */}
        <Link to="/" className={styles.logo}>
          ✅ <span className={styles.brand}>Task Manager</span>
        </Link>

        {/* Navigation links */}
        <Link to="/" className={styles.link}>Dashboard</Link>
        <Link to="/calendar" className={styles.link}>📅 Calendar</Link>
      </div>

      {/* Right section of the navbar */}
      <div className={styles.right}>
        {/* Dark mode toggle button */}
        <button
          onClick={toggleDarkMode}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        {/* Display user information if logged in */}
        {user && <span className={styles.user}>👤 {user.name}</span>}

        {/* Logout button */}
        <button
          className={styles.logout}
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

