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
  const rest = posts.length > 1 ? posts.slice(1) : [];

  return (
    <main style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ width: '100%', maxHeight: 340, overflow: 'hidden', marginBottom: '2.5rem' }}>
        <img src={heroImg} alt="Hero" style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 2.5rem' }}>
        {/* Featured Post */}
        {featured && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 1.5rem 0', letterSpacing: '-1.5px' }}>Featured</h1>
            <Card post={featured} highlight onClick={() => window.location.href = `/posts/${featured.id}`} />
          </section>
        )}

        {/* Recent Posts */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1.2rem 0', letterSpacing: '-0.5px' }}>Recent Posts</h2>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && rest.length === 0 && <div>No recent posts yet.</div>}
          <div>
            {rest.map((post, i) => (
              <Card
                key={post.id}
                post={post}
                layout={i % 2 === 0 ? 'left' : 'right'}
                onClick={() => window.location.href = `/posts/${post.id}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Landing; 