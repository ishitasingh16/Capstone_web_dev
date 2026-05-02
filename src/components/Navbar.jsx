import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Search, Home } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/">
          <h2>SocialStream <span className="text-gradient">Analytics</span></h2>
        </NavLink>
      </div>
      
      <div className={styles.navLinks}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <Search size={20} />
          <span>Search</span>
        </NavLink>
      </div>

      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
