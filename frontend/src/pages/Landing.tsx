import React, { useEffect, useState } from 'react';
import * as api from '../api';
import Card from '../components/Card';

const heroImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';

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

  const featured = posts.length ? { ...posts[0], image: heroImg } : null;
  const rest = posts.length > 1 ? posts.slice(1).map((p: any, i: number) => ({ ...p, image: i % 2 === 0 ? heroImg : undefined })) : [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem 2.5rem 1.5rem' }}>
      {featured && (
        <div style={{ marginBottom: '2.5rem' }}>
          <img src={heroImg} alt="Hero" style={{ width: '100%', borderRadius: 18, marginBottom: '2.2rem', objectFit: 'cover', maxHeight: 320 }} />
          <Card post={featured} highlight onClick={() => window.location.href = `/posts/${featured.id}`} />
        </div>
      )}
      {loading ? (
        <div>Loading posts...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : posts.length === 0 ? (
        <div>No posts yet. Stay tuned!</div>
      ) : (
        <>
          <h2 style={{ margin: '2.5rem 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 700 }}>Recent Posts</h2>
          <div>
            {rest.map((post: any) => (
              <Card key={post.id} post={post} onClick={() => window.location.href = `/posts/${post.id}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Landing; 