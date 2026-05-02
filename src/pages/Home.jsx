import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import styles from './Pages.module.css'; // Shared styles for pages

const Home = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch global trending (e.g., r/popular)
    const fetchTrending = async () => {
      try {
        const response = await axios.get('/api/reddit/r/popular/hot.json?limit=10');
        const posts = response.data.data.children.map(child => child.data);
        setTrendingData(posts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch trending analytics.");
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Global <span className="text-gradient">Trending</span> Analytics</h1>
        <p>Top engagement metrics from across the platform right now.</p>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && (
        <div className={styles.gridContainer}>
          {trendingData.map(post => (
            <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate(`/analytics/${post.subreddit}`)}>
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <span><strong>r/{post.subreddit}</strong></span>
                <span>👍 {post.ups.toLocaleString()}</span>
                <span>💬 {post.num_comments.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
