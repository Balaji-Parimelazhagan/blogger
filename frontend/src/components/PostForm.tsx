import React, { useState, useEffect, useRef } from 'react';

interface PostFormProps {
  initial?: {
    title?: string;
    content?: string;
    excerpt?: string;
    published?: boolean;
  };
  onSubmit: (data: { title: string; content: string; excerpt?: string; published: boolean }) => Promise<void>;
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
  const [content, setContent] = useState(initial.content || '');
  const [excerpt, setExcerpt] = useState(initial.excerpt || '');
  const [published, setPublished] = useState(initial.published ?? false);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current && (initial.title || initial.content || initial.excerpt)) {
      setTitle(initial.title || '');
      setContent(initial.content || '');
      setExcerpt(initial.excerpt || '');
      didInit.current = true;
    }
  }, [initial.title, initial.content, initial.excerpt]);

  const isValid = title.trim().length > 2 && content.trim().length > 10;

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setTouched({ title: true, content: true });
    setFormError(null);
    if (!isValid) {
      setFormError('Please fill all fields correctly.');
      return;
    }
    try {
      await onSubmit({ title, content, excerpt, published: publish });
    } catch (err: any) {
      setFormError(err.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={e => handleSubmit(e, published)} noValidate>
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
          style={{ width: '100%', padding: '0.5em', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.18)', outline: 'none', fontSize: '1em' }}
          disabled={loading}
        />
        {touched.title && title.trim().length < 3 && (
          <div style={{ color: 'red', fontSize: '0.9em' }}>Title must be at least 3 characters.</div>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="content">Content</label><br />
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, content: true }))}
          required
          minLength={10}
          rows={8}
          style={{ width: '100%', padding: '0.5em', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.18)', outline: 'none', fontSize: '1em' }}
          disabled={loading}
        />
        {touched.content && content.trim().length < 10 && (
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
          style={{ width: '100%', padding: '0.5em', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.18)', outline: 'none', fontSize: '1em' }}
          disabled={loading}
        />
      </div>
      {(formError || error) && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{formError || error}</div>
      )}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          type="button"
          disabled={loading || !isValid}
          style={{
            flex: 1,
            background: '#fff',
            color: '#111',
            border: '1.5px solid #111',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '1.08em',
            padding: '0.7em 0',
            cursor: loading || !isValid ? 'not-allowed' : 'pointer',
            transition: 'background 0.18s',
          }}
          onClick={e => handleSubmit(e as any, false)}
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={loading || !isValid}
          style={{
            flex: 1,
            background: '#111',
            color: '#fff',
            border: '1.5px solid #111',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '1.08em',
            padding: '0.7em 0',
            cursor: loading || !isValid ? 'not-allowed' : 'pointer',
            transition: 'background 0.18s',
          }}
          onClick={e => handleSubmit(e as any, true)}
        >
          Publish
        </button>
      </div>
    </form>
  );
};

export default PostForm; 