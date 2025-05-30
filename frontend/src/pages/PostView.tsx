import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import Avatar from '../components/Avatar';
import CommentList from '../components/CommentList';
import type { CommentListRef } from '../components/CommentList';
import RelatedPosts from '../components/RelatedPosts';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../AuthContext';

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const commentListRef = useRef<CommentListRef>(null);
  const { user } = useAuth();

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

  const handleAddComment = async (content: string) => {
    setCommentLoading(true);
    setCommentError(null);
    try {
      await api.addComment(post.id, content);
      if (commentListRef.current) commentListRef.current.refresh();
    } catch (err: any) {
      setCommentError(err.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

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
        {user ? (
          <CommentForm onSubmit={handleAddComment} loading={commentLoading} error={commentError} />
        ) : (
          <div style={{ marginBottom: '1rem', color: '#888' }}>Sign in to add a comment.</div>
        )}
        <CommentList ref={commentListRef} postId={post.id} />
      </section>
      <section className="card">
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Related Posts</h2>
        <RelatedPosts postId={post.id} userId={user?.id} authorId={post.authorId} />
      </section>
    </div>
  );
};

export default PostView; 