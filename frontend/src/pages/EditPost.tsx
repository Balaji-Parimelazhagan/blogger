import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import * as api from '../api';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getPostById(Number(id))
      .then(setPost)
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: { title: string; body: string; excerpt?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.updatePost(Number(id), data);
      setSuccess(true);
      setTimeout(() => navigate(`/posts/${id}`), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading post...</div>;
  if (error || !post) return <div className="container" style={{ color: 'red' }}>{error || 'Post not found.'}</div>;

  return (
    <div className="card" style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Edit Post</h2>
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>Post updated! Redirecting...</div>
      ) : (
        <PostForm initial={post} onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Save Changes" />
      )}
    </div>
  );
};

export default EditPost; 