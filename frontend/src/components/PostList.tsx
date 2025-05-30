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
}

const PostList: React.FC<PostListProps> = ({ posts, onClick }) => {
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
            style={{ marginBottom: '0.7rem', cursor: 'pointer' }}
            onClick={() => onClick ? onClick(post) : navigate(`/posts/${post.id}`)}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
            {snippet && <p style={{ marginBottom: '0.5rem', color: '#444', fontSize: '1em' }}>{snippet}</p>}
            <div style={{ fontSize: '0.95em', color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default PostList; 