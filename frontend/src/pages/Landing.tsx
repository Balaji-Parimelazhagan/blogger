import React, { useEffect, useState } from 'react';
import * as api from '../api';
import Card from '../components/Card';
import PostList from '../components/PostList';

const Landing: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts.length ? posts[0] : null;
  const rest = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', fontSize: '2.2rem', fontWeight: 700 }}>Welcome to Bloggr</h1>
      {loading ? (
        <div>Loading posts...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : posts.length === 0 ? (
        <div>No posts yet. Stay tuned!</div>
      ) : (
        <>
          {featured && (
            <Card post={featured} highlight />
          )}
          {rest.length > 0 && (
            <>
              <h2 style={{ margin: '2rem 0 1rem 0' }}>Recent Posts</h2>
              <PostList posts={rest} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Landing; 