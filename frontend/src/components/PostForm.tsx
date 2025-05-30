import React, { useState, useEffect } from 'react';

interface PostFormProps {
  initial?: {
    title?: string;
    body?: string;
    excerpt?: string;
  };
  onSubmit: (data: { title: string; body: string; excerpt?: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
}

const PostForm: React.FC<PostFormProps> = ({
  initial = {},
  onSubmit,
  loading = false,
  error = null,
  submitLabel = 'Submit',
}) => {
  const [title, setTitle] = useState(initial.title || '');
  const [body, setBody] = useState(initial.body || '');
  const [excerpt, setExcerpt] = useState(initial.excerpt || '');
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initial.title || '');
    setBody(initial.body || '');
    setExcerpt(initial.excerpt || '');
  }, [initial]);

  const isValid = title.trim().length > 2 && body.trim().length > 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true });
    setFormError(null);
    if (!isValid) {
      setFormError('Please fill all fields correctly.');
      return;
    }
    try {
      await onSubmit({ title, body, excerpt });
    } catch (err: any) {
      setFormError(err.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="title">Title</label><br />
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, title: true }))}
          required
          minLength={3}
          style={{ width: '100%', padding: '0.5em' }}
          disabled={loading}
        />
        {touched.title && title.trim().length < 3 && (
          <div style={{ color: 'red', fontSize: '0.9em' }}>Title must be at least 3 characters.</div>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="body">Content</label><br />
        <textarea
          id="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, body: true }))}
          required
          minLength={10}
          rows={8}
          style={{ width: '100%', padding: '0.5em' }}
          disabled={loading}
        />
        {touched.body && body.trim().length < 10 && (
          <div style={{ color: 'red', fontSize: '0.9em' }}>Content must be at least 10 characters.</div>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="excerpt">Excerpt (optional)</label><br />
        <input
          id="excerpt"
          type="text"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          style={{ width: '100%', padding: '0.5em' }}
          disabled={loading}
        />
      </div>
      {(formError || error) && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{formError || error}</div>
      )}
      <button type="submit" disabled={loading || !isValid} style={{ width: '100%' }}>
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};

export default PostForm; 