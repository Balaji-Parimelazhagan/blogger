import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

interface RelatedPostsProps {
  postId: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ postId }) => {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getRelatedPosts(postId)
      .then(setRelated)
      .catch(() => setError('Failed to load related posts'))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <div>Loading related posts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!related.length) return <div>No related posts.</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {related.map((p) => (
        <li key={p.id} style={{ marginBottom: '1rem' }}>
          <Link to={`/posts/${p.id}`} style={{ color: '#2563eb', fontWeight: 600 }}>{p.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default RelatedPosts; 