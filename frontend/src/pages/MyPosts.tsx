import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import PostList from '../components/PostList';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

const MyPosts: React.FC = () => {
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(id);
    try {
      await api.deletePost(id);
      setPosts(posts => posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>My Posts & Drafts</h2>
      {loading ? (
        <div>Loading your posts...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : posts.length === 0 ? (
        <div>You have no posts yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} className="card" style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/posts/${post.id}`)}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                  {post.excerpt && <p style={{ marginBottom: '0.5rem' }}>{post.excerpt}</p>}
                  <div style={{ fontSize: '0.95em', color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  style={{ marginLeft: '1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5em 1em', cursor: 'pointer' }}
                >
                  {deleting === post.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPosts; 