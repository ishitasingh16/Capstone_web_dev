import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import styles from './Pages.module.css';

const SubredditDetail = () => {
  const { subredditId } = useParams();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("upvotes");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchSubredditData = async () => {
      setLoading(true);
      setError(null);
      setVisibleCount(10); 

      try {
        const response = await axios.get(`https://www.reddit.com/r/${subredditId}/hot.json?limit=50`);
        const fetchedPosts = response.data.data.children.map(child => child.data);
        setPosts(fetchedPosts);
      } catch (err) {
        setError(`Failed to fetch analytics for r/${subredditId}. It may be private or not exist.`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubredditData();
  }, [subredditId]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  // Sort posts based on selection
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "upvotes") {
      return b.ups - a.ups;
    } else {
      return b.num_comments - a.num_comments;
    }
  });

  const visiblePosts = sortedPosts.slice(0, visibleCount);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', border: 'none', color: 'var(--accent-primary)', 
            cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' 
          }}
        >
          &larr; Back
        </button>
        <h1>r/{subredditId} <span className="text-gradient">Analytics</span></h1>
        <p>In-depth engagement data and trends.</p>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className={styles.controls}>
            <h3>Showing top posts</h3>
            <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
              <option value="upvotes">Most Upvoted</option>
              <option value="comments">Most Comments</option>
            </select>
          </div>

          <div className={styles.gridContainer}>
            {visiblePosts.map(post => (
              <div key={post.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </a>
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>👍 {post.ups.toLocaleString()}</span>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>💬 {post.num_comments.toLocaleString()}</span>
                  <span>by u/{post.author}</span>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < posts.length && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}

      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No posts found.
        </div>
      )}
    </div>
  );
};

export default SubredditDetail;
