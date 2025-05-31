import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Avatar from '../components/Avatar';
import PostList from '../components/PostList';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getPostsByAuthor(user.id)
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleEdit = (post: any) => {
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDelete = async (post: any) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(post.id);
    try {
      await api.deletePost(post.id);
      setPosts(posts => posts.filter((p: any) => p.id !== post.id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

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
        <PostList
          posts={posts.map(post => ({ ...post, createdAt: post.created_at }))}
          onEdit={handleEdit}
          onDelete={deleting ? (post => post.id === deleting ? () => {} : handleDelete(post)) : handleDelete}
        />
      )}
    </div>
  );
};

export default Profile; 