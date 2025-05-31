import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  body?: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
  onClick?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onClick, onEdit, onDelete }) => {
  const navigate = useNavigate();
  if (!posts.length) return <div>No posts yet.</div>;
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map((post) => {
        let snippet = post.excerpt;
        if (!snippet) {
          const text = post.content || post.body || '';
          snippet = text.length > 0 ? text.replace(/<[^>]+>/g, '').slice(0, 100) + (text.length > 100 ? '...' : '') : '';
        }
        return (
          <li
            key={post.id}
            className="card"
            style={{ marginBottom: '0.7rem', cursor: onClick ? 'pointer' : 'default', position: 'relative' }}
            onClick={onClick ? () => onClick(post) : undefined}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                {snippet && <p style={{ marginBottom: '0.5rem', color: '#444', fontSize: '1em' }}>{snippet}</p>}
                <div style={{ fontSize: '0.95em', color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
              {(onEdit || onDelete) && (
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  {onEdit && (
                    <button
                      onClick={e => { e.stopPropagation(); onEdit(post); }}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5em 1em', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(post); }}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5em 1em', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PostList; 