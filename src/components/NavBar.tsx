import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/NavBar.module.css';
import { useDarkMode } from '../hooks/useDarkMode';

const NavBar: React.FC = () => {
  const { logout, user, isAuthenticated } = useAuth0();
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <nav className={styles.navbar}>
      {/* Left section */}
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          ✅ <span className={styles.brand}>Task Manager</span>
        </Link>
        <Link to="/" className={styles.link}>Dashboard</Link>
        <Link to="/calendar" className={styles.link}>📅 Calendar</Link>
      </div>

      {/* Right section */}
      <div className={styles.right}>
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className={styles.themeToggle}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        {/* User info & logout */}
        {isAuthenticated && user && (
          <>
            <span className={styles.user}>👤 {user.name || user.email}</span>
            <button
              className={styles.logout}
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
