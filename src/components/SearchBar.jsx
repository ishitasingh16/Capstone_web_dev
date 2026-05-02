import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, placeholder = "Search stories..." }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== "") {
        onSearch(query.trim());
      }
    }, 600); // 600ms delay as requested

    // Cleanup function
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query.trim());
    }
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <Search className={styles.searchIcon} size={20} />
      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
