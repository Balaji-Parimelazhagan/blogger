import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import * as api from '../api';

const CreatePost: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: { title: string; content: string; excerpt?: string; published: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const post = await api.createPost(data);
      setSuccess(true);
      setPublishedSuccess(data.published);
      setTimeout(() => navigate(`/posts/${post.id}`), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Create New Post</h2>
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>{publishedSuccess ? 'Post published!' : 'Draft saved!'} Redirecting...</div>
      ) : (
        <PostForm onSubmit={handleSubmit} loading={loading} error={error} submitLabel="Create Post" />
      )}
    </div>
  );
};

export default CreatePost; 