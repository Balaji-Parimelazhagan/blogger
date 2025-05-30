import React from 'react';

interface CardProps {
  post: {
    id: number;
    title: string;
    excerpt?: string;
    image?: string;
  };
  onClick?: () => void;
  highlight?: boolean;
}

const placeholder = 'https://via.placeholder.com/160x120?text=Image';

const Card: React.FC<CardProps> = ({ post, onClick, highlight = false }) => (
  <div
    className="card"
    style={{
      display: 'flex',
      alignItems: 'stretch',
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      marginBottom: '2rem',
      cursor: onClick ? 'pointer' : undefined,
      border: highlight ? '2px solid #2563eb' : '1px solid #eee',
      padding: highlight ? '2rem' : '1.5rem',
      transition: 'box-shadow 0.2s',
      minHeight: 140,
      gap: '2rem',
    }}
    onClick={onClick}
  >
    <img
      src={post.image || placeholder}
      alt="Post visual"
      style={{
        width: 160,
        height: 120,
        objectFit: 'cover',
        borderRadius: 12,
        background: '#f3f3f3',
        flexShrink: 0,
        alignSelf: 'center',
      }}
    />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ margin: 0, fontSize: highlight ? '1.6rem' : '1.2rem', fontWeight: 700 }}>{post.title}</h2>
      {post.excerpt && <p style={{ margin: '0.7rem 0 1.2rem 0', color: '#444', fontSize: '1rem', lineHeight: 1.5 }}>{post.excerpt}</p>}
      <div style={{ marginTop: 'auto' }}>
        <button
          style={{
            background: highlight ? '#111' : '#fff',
            color: highlight ? '#fff' : '#111',
            border: '1.5px solid #111',
            borderRadius: 999,
            padding: '0.45em 1.3em',
            fontWeight: 600,
            fontSize: '1em',
            cursor: 'pointer',
            boxShadow: highlight ? '0 2px 8px rgba(37,99,235,0.08)' : undefined,
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={onClick}
        >
          Read more
        </button>
      </div>
    </div>
  </div>
);

export default Card; 