import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import Avatar from '../components/Avatar';
import CommentList from '../components/CommentList';
import type { CommentListRef } from '../components/CommentList';
import RelatedPosts from '../components/RelatedPosts';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../AuthContext';

const heroImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';

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
    setLoading(true);
    api.getPostById(Number(id))
      .then(async (p) => {
        setPost(p);
        const a = await api.getUserById(p.author_id);
        setAuthor(a);
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (content: string) => {
    setCommentLoading(true);
    setCommentError(null);
    try {
      await api.addComment(Number(id), content);
      commentListRef.current?.refresh();
    } catch (e: any) {
      setCommentError(e.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const getContent = () => {
    if (post.content_html) {
      return <div dangerouslySetInnerHTML={{ __html: post.content_html }} />;
    }
    if (post.content) {
      return <div>{post.content}</div>;
    }
    return <div style={{ color: '#888' }}>No content available.</div>;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (error || !post) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error || 'Post not found.'}</div>;

  return (
    <main style={{ background: '#f7f8fa', minHeight: '100vh', padding: '0 0 3rem 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap', padding: '2.5rem 2rem 0 2rem' }}>
        {/* Main Content */}
        <section style={{ flex: '1 1 600px', minWidth: 0 }}>
          {/* Hero Section */}
          <div style={{ marginBottom: '2.5rem', background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '2.5rem 2.5rem 2rem 2.5rem' }}>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, margin: 0, letterSpacing: '-1.5px', lineHeight: 1.15 }}>{post.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', margin: '1.2rem 0 0.7rem 0' }}>
              <Avatar name={author?.name || 'Unknown'} avatarUrl={author?.avatar_url} size={44} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#222' }}>{author?.name}</div>
                <div style={{ fontSize: '0.97rem', color: '#888' }}>{new Date(post.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            {/* Optional hero image */}
            <img src={post.image || heroImg} alt="Hero" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 14, margin: '1.5rem 0 0.5rem 0' }} />
          </div>

          {/* Post Content */}
          <article style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '2.2rem 2.5rem', marginBottom: '2.5rem', fontSize: '1.15rem', lineHeight: 1.7, color: '#222' }}>
            {getContent()}
          </article>

          {/* Comments Section */}
          <section style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '2.2rem 2.5rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 1.2rem 0' }}>Comments</h2>
            <CommentList ref={commentListRef} postId={post.id} />
            {user && (
              <div style={{ marginTop: '2rem' }}>
                <CommentForm onSubmit={handleComment} loading={commentLoading} error={commentError} />
              </div>
            )}
            {!user && <div style={{ marginTop: '2rem', color: '#888' }}>Sign in to add a comment.</div>}
          </section>
        </section>

        {/* Sidebar */}
        <aside style={{ flex: '0 0 320px', minWidth: 280, maxWidth: 340, width: '100%' }}>
          <div style={{ position: 'sticky', top: 32 }}>
            <section className="card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '2rem 1.5rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1.2rem 0' }}>Related Posts</h2>
              <RelatedPosts postId={post.id} userId={user?.id} authorId={post.author_id} />
            </section>
          </div>
        </aside>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          main > div { flex-direction: column; gap: 0.5rem; }
          aside { max-width: 100% !important; min-width: 0 !important; width: 100% !important; }
        }
        @media (max-width: 600px) {
          main > div { padding: 0.5rem !important; }
          section, article { padding: 1.1rem !important; }
        }
      `}</style>
    </main>
  );
};

export default PostView; 