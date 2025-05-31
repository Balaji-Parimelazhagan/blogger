import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

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
            {(onEdit || onDelete) && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 16,
                display: 'flex',
                gap: '0.5rem',
                zIndex: 2,
              }}>
                {onEdit && (
                  <button
                    onClick={e => { e.stopPropagation(); onEdit(post); }}
                    aria-label="Edit post"
                    style={{
                      background: '#fff',
                      border: '2px solid #888',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: 20,
                      outline: 'none',
                      padding: 0,
                    }}
                  >
                    <FiEdit2 color="#888" size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(post); }}
                    aria-label="Delete post"
                    style={{
                      background: '#fff',
                      border: '2px solid #888',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: 20,
                      outline: 'none',
                      padding: 0,
                    }}
                  >
                    <FiTrash2 color="#888" size={18} />
                  </button>
                )}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
            {snippet && <p style={{ marginBottom: '0.5rem', color: '#444', fontSize: '1em' }}>{snippet}</p>}
            <div style={{ fontSize: '0.95em', color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PostList; 