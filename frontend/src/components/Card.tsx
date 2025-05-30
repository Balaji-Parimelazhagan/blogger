import React from 'react';

interface CardProps {
  post: {
    id: number;
    title: string;
    excerpt?: string;
    createdAt: string;
    author?: { name: string };
  };
  onClick?: () => void;
  highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ post, onClick, highlight = false }) => (
  <div
    className="card"
    style={{
      cursor: onClick ? 'pointer' : undefined,
      background: highlight ? '#f1f5fd' : undefined,
      boxShadow: highlight ? '0 4px 16px rgba(37,99,235,0.08)' : undefined,
      border: highlight ? '1.5px solid #2563eb' : undefined,
      padding: highlight ? '2rem' : undefined,
      marginBottom: '1.5rem',
      transition: 'box-shadow 0.2s',
    }}
    onClick={onClick}
  >
    <h2 style={{ marginBottom: '0.5rem' }}>{post.title}</h2>
    {post.excerpt && <p style={{ marginBottom: '0.5rem' }}>{post.excerpt}</p>}
    <div style={{ fontSize: '0.95em', color: '#666' }}>
      {new Date(post.createdAt).toLocaleDateString()} {post.author && `· by ${post.author.name}`}
    </div>
  </div>
);

export default Card; 