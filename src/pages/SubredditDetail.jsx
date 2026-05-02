import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import styles from './Pages.module.css';

const stripHtml = (value = '') =>
  new DOMParser().parseFromString(value, 'text/html').body.textContent || '';

const SubredditDetail = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchStoryData = async () => {
      setLoading(true);
      setError(null);
      setVisibleCount(10);

      try {
        const storyResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
        );

        if (!storyResponse.ok) {
          throw new Error(`Error: ${storyResponse.status}`);
        }

        const storyData = await storyResponse.json();

        if (!storyData) {
          throw new Error('Story not found');
        }

        setStory(storyData);

        const commentIds = Array.isArray(storyData.kids) ? storyData.kids.slice(0, 20) : [];
        const commentResponses = await Promise.all(
          commentIds.map(async (commentId) => {
            const response = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
            );

            if (!response.ok) {
              return null;
            }

            return response.json();
          })
        );

        setComments(commentResponses.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch story analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoryData();
  }, [storyId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem',
            fontWeight: 'bold',
          }}
        >
          &larr; Back
        </button>
        <h1>Story <span className="text-gradient">Analytics</span></h1>
        <p>Top-level discussion and engagement from Hacker News.</p>
      </header>

      {loading && <Loader />}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {!loading && !error && story && (
        <>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>{story.title}</h2>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}
            >
              <span>▲ {(story.points || 0).toLocaleString()} Points</span>
              <span>💬 {(story.descendants || comments.length || 0).toLocaleString()} Comments</span>
              <span>by {story.by}</span>
              {story.url && (
                <a href={story.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>
                  Open original story
                </a>
              )}
            </div>
            {story.text && (
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                {stripHtml(story.text)}
              </p>
            )}
          </div>

          <div className={styles.controls}>
            <h3>Top comments</h3>
          </div>

          {visibleComments.length > 0 ? (
            <div className={styles.gridContainer}>
              {visibleComments.map((comment) => (
                <div key={comment.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    by {comment.by || 'unknown'}
                  </p>
                  <div>{stripHtml(comment.text || '')}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No comments found.
            </div>
          )}

          {visibleCount < comments.length && (
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}

      {!loading && !error && !story && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Story not found.
        </div>
      )}
    </div>
  );
};

export default SubredditDetail;
