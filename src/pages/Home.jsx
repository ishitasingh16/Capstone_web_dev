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
        const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!idsRes.ok) throw new Error(`Error fetching topstories: ${idsRes.status}`);
        const ids = await idsRes.json();

        const topIds = Array.isArray(ids) ? ids.slice(0, 10) : [];

        const items = await Promise.all(
          topIds.map(async (id) => {
            try {
              const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
              if (!r.ok) return null;
              const it = await r.json();
              return it || null;
            } catch (e) {
              return null;
            }
          })
        );

        const posts = (items.filter(Boolean)).map((it) => ({
          id: it.id,
          title: it.title || 'No title',
          author: it.by || 'unknown',
          points: it.score || 0,
          num_comments: it.descendants || 0,
          url: it.url || null,
          source: it.url ? (() => { try { return new URL(it.url).hostname } catch { return 'news.ycombinator.com' } })() : 'news.ycombinator.com',
        }));

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
