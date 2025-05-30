import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api';

interface RelatedPostsProps {
  postId: number;
  userId?: number;
  authorId?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ postId, userId, authorId }) => {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addId, setAddId] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchRelated = () => {
    setLoading(true);
    api.getRelatedPosts(postId)
      .then(setRelated)
      .catch(() => setError('Failed to load related posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRelated();
    // eslint-disable-next-line
  }, [postId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!addId.trim() || isNaN(Number(addId))) {
      setAddError('Enter a valid post ID');
      return;
    }
    setAddLoading(true);
    try {
      await api.addRelatedPost(postId, Number(addId));
      setAddId('');
      fetchRelated();
    } catch (err: any) {
      setAddError(err.message || 'Failed to add related post');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (relatedId: number) => {
    setRemoving(relatedId);
    try {
      await api.removeRelatedPost(postId, relatedId);
      setRelated(related => related.filter((p: any) => p.id !== relatedId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove related post');
    } finally {
      setRemoving(null);
    }
  };

  const isAuthor = userId && authorId && userId === authorId;

  if (loading) return <div>Loading related posts...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      {isAuthor && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="number"
            min={1}
            value={addId}
            onChange={e => setAddId(e.target.value)}
            placeholder="Related Post ID"
            style={{ flex: 1, padding: '0.5em' }}
            disabled={addLoading}
          />
          <button type="submit" disabled={addLoading || !addId.trim()} style={{ padding: '0.5em 1em' }}>
            {addLoading ? 'Adding...' : 'Add'}
          </button>
        </form>
      )}
      {addError && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{addError}</div>}
      {related.length === 0 ? (
        <div>No related posts.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {related.map((p: any) => (
            <li key={p.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to={`/posts/${p.id}`} style={{ color: '#2563eb', fontWeight: 600 }}>{p.title}</Link>
              {isAuthor && (
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={removing === p.id}
                  style={{ marginLeft: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2em 0.7em', cursor: 'pointer', fontSize: '0.95em' }}
                >
                  {removing === p.id ? 'Removing...' : 'Remove'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RelatedPosts; 