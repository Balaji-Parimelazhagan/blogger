import React from 'react';

interface Post {
  id: number;
  title: string;
  excerpt?: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
  onClick?: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onClick }) => {
  if (!posts.length) return <div>No posts yet.</div>;
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map((post) => (
        <li key={post.id} className="card" style={{ marginBottom: '1.5rem', cursor: onClick ? 'pointer' : undefined }}
            onClick={onClick ? () => onClick(post) : undefined}>
          <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
          {post.excerpt && <p style={{ marginBottom: '0.5rem' }}>{post.excerpt}</p>}
          <div style={{ fontSize: '0.95em', color: '#666' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  );
};

export default PostList; 