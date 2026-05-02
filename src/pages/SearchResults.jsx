import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import styles from './Pages.module.css';

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('points');
  const [visibleCount, setVisibleCount] = useState(10);

  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    setVisibleCount(10);

    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(searchQuery)}&tags=story`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const stories = data?.hits?.map((hit) => ({
        id: hit.objectID,
        title: hit.title,
        author: hit.author,
        points: hit.points || 0,
        num_comments: hit.num_comments || 0,
        created_at_i: hit.created_at_i || 0,
        url: hit.url,
      })) || [];

      if (stories.length === 0) {
        setError('No stories found matching your query.');
        setResults([]);
      } else {
        setResults(stories);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch search results.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'points') {
      return (b.points || 0) - (a.points || 0);
    }

    return (b.created_at_i || 0) - (a.created_at_i || 0);
  });

  const visibleResults = sortedResults.slice(0, visibleCount);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Find <span className="text-gradient">Stories</span></h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search stories (e.g. React, AI, startups)" />
        </div>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && results.length > 0 && (
        <>
          <div className={styles.controls}>
            <h3>Showing results for "{query}"</h3>
            <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
              <option value="points">Most Points</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className={styles.gridContainer}>
            {visibleResults.map((story) => (
              <div
                key={story.id}
                className="glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer' }}
                onClick={() => navigate(`/analytics/${story.id}`)}
              >
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{story.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {story.url || 'Discussion on Hacker News'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span>▲ {(story.points || 0).toLocaleString()} Points</span>
                  <span>💬 {(story.num_comments || 0).toLocaleString()} Comments</span>
                  <span>by {story.author}</span>
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
