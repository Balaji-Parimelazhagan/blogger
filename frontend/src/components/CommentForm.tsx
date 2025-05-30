import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, loading = false, error = null }) => {
  const [content, setContent] = useState('');
  const [touched, setTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isValid = content.trim().length > 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);
    if (!isValid) {
      setFormError('Comment must be at least 3 characters.');
      return;
    }
    try {
      await onSubmit(content.trim());
      setContent('');
      setTouched(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginBottom: '1.5rem' }}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        onBlur={() => setTouched(true)}
        rows={3}
        style={{ width: '100%', padding: '0.5em', resize: 'vertical' }}
        placeholder="Add a comment..."
        disabled={loading}
        required
        minLength={3}
      />
      {touched && content.trim().length < 3 && (
        <div style={{ color: 'red', fontSize: '0.9em' }}>Comment must be at least 3 characters.</div>
      )}
      {(formError || error) && (
        <div style={{ color: 'red', marginBottom: '0.5rem' }}>{formError || error}</div>
      )}
      <button type="submit" disabled={loading || !isValid} style={{ marginTop: '0.5rem', width: '100%' }}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm; 