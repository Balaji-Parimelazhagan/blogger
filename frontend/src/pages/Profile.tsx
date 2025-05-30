import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Avatar from '../components/Avatar';
import PostList from '../components/PostList';
import * as api from '../api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getPostsByAuthor(user.id)
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Avatar name={user.name} size={64} />
        <div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <div style={{ color: '#666' }}>{user.email}</div>
        </div>
      </div>
      <h3 style={{ marginTop: '2rem' }}>My Posts</h3>
      {loading ? (
        <div>Loading posts...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
};

export default Profile; 