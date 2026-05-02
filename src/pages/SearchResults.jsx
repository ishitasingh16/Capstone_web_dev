import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import styles from './Pages.module.css';

const SearchResults = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("upvotes"); // upvotes or comments
  const [visibleCount, setVisibleCount] = useState(10);
  
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    setVisibleCount(10); // reset pagination

    try {
      // Searching subreddits via the Reddit search API
      const response = await axios.get(`https://www.reddit.com/subreddits/search.json?q=${searchQuery}&limit=50`);
      const subs = response.data.data.children.map(child => child.data);
      
      if (subs.length === 0) {
        setError("No subreddits found matching your query.");
        setResults([]);
      } else {
        // Map to a consistent format. Subreddit search returns subreddits, not posts.
        setResults(subs);
      }
    } catch (err) {
      setError("Failed to fetch search results.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Sort logic for Subreddits
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "subscribers") {
      return (b.subscribers || 0) - (a.subscribers || 0);
    } else {
      // Create date sort
      return (b.created_utc || 0) - (a.created_utc || 0);
    }
  });

  const visibleResults = sortedResults.slice(0, visibleCount);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Find <span className="text-gradient">Communities</span></h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search for subreddits (e.g. reactjs, python)" />
        </div>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && results.length > 0 && (
        <>
          <div className={styles.controls}>
            <h3>Showing results for "{query}"</h3>
            <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
              <option value="subscribers">Most Subscribers</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className={styles.gridContainer}>
            {visibleResults.map(sub => (
              <div 
                key={sub.id} 
                className="glass-panel" 
                style={{ padding: '1.5rem', cursor: 'pointer' }} 
                onClick={() => navigate(`/analytics/${sub.display_name}`)}
              >
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>r/{sub.display_name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {sub.public_description ? sub.public_description.substring(0, 120) + '...' : 'No description provided.'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <span>👥 {(sub.subscribers || 0).toLocaleString()} Subscribers</span>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < results.length && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
