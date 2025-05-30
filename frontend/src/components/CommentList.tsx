import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import * as api from '../api';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getCommentsByPost(postId)
      .then(setComments)
      .catch(() => setError('Failed to load comments'))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {comments.map((c) => (
        <li key={c.id} style={{ marginBottom: '1.25rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Avatar name={c.author?.name || 'User'} size={32} />
            <div style={{ fontWeight: 600 }}>{c.author?.name || 'User'}</div>
            <div style={{ color: '#888', fontSize: '0.95em' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={{ fontSize: '1.05rem' }}>{c.content}</div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList; 