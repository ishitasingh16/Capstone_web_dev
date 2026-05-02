import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import styles from './Pages.module.css';

const Home = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          'https://hn.algolia.com/api/v1/search?tags=front_page'
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const posts = data?.hits?.map((hit) => ({
          id: hit.objectID,
          title: hit.title,
          author: hit.author,
          points: hit.points || 0,
          num_comments: hit.num_comments || 0,
          url: hit.url,
          source: hit.url
            ? (() => {
                try {
                  return new URL(hit.url).hostname;
                } catch {
                  return 'news.ycombinator.com';
                }
              })()
            : 'news.ycombinator.com',
        })) || [];

        setTrendingData(posts);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch trending data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>
          Global <span className="text-gradient">Trending</span> Analytics
        </h1>
        <p>Top stories from Hacker News right now.</p>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && (
        <div className={styles.gridContainer}>
          {trendingData.map((post) => (
            <div
              key={post.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/analytics/${post.id}`)}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  <strong>{post.source}</strong>
                </span>
                <span>▲ {post.points}</span>
                <span>💬 {post.num_comments}</span>
                <span>by {post.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;