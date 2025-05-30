import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import Avatar from '../components/Avatar';
import CommentList from '../components/CommentList';
import RelatedPosts from '../components/RelatedPosts';

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getPostById(Number(id))
      .then((p) => {
        setPost(p);
        return api.getUserById(p.authorId);
      })
      .then(setAuthor)
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading post...</div>;
  if (error || !post) return <div className="container" style={{ color: 'red' }}>{error || 'Post not found.'}</div>;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <article className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Avatar name={author?.name || 'Unknown'} size={40} />
          <div>
            <div style={{ fontWeight: 600 }}>{author?.name || 'Unknown'}</div>
            <div style={{ color: '#666', fontSize: '0.95em' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        <div style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
          {post.body || post.content}
        </div>
      </article>
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Comments</h2>
        <CommentList postId={post.id} />
      </section>
      <section className="card">
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Related Posts</h2>
        <RelatedPosts postId={post.id} />
      </section>
    </div>
  );
};

export default PostView; 