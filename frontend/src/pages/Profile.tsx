import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Avatar from '../components/Avatar';
import PostList from '../components/PostList';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editBio, setEditBio] = useState(user?.bio ?? '');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getPostsByAuthor(user.id)
      .then(setPosts)
      .catch(() => setError('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleEdit = (post: any) => {
    navigate(`/posts/${post.id}/edit`);
  };

  const handleDelete = async (post: any) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(post.id);
    setDeleteError(null);
    try {
      await api.deletePost(post.id);
      setPosts(posts => posts.filter((p: any) => p.id !== post.id));
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const handleEditProfile = () => {
    if (!user) return;
    setEditName(user.name ?? '');
    setEditBio(user.bio ?? '');
    setEditing(true);
    setUpdateError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const updated = await api.updateUser(user.id, { name: editName, bio: editBio });
      setEditing(false);
      setEditName(updated.name ?? '');
      setEditBio(updated.bio ?? '');
      window.location.reload();
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: 600, margin: '2rem auto', position: 'relative' }}>
      {!editing && (
        <button
          onClick={handleEditProfile}
          aria-label="Edit Profile"
          style={{
            position: 'absolute',
            top: 18,
            right: 24,
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
            zIndex: 2,
          }}
        >
          <FiEdit2 color="#888" size={18} />
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Avatar name={user.name} size={64} />
        <div style={{ flex: 1, position: 'relative' }}>
          {editing ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
                minLength={2}
                style={{ width: '100%', padding: '0.3em 0.5em', borderRadius: 8, border: '1.5px solid rgba(0,0,0,0.18)', outline: 'none', fontSize: '1.3em', fontWeight: 700, marginBottom: 4 }}
                disabled={updateLoading}
              />
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '0.3em 0.5em', borderRadius: 8, border: '1.5px solid rgba(0,0,0,0.18)', outline: 'none', fontSize: '1.05em', marginBottom: 4, resize: 'vertical' }}
                disabled={updateLoading}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="Cancel"
                  disabled={updateLoading}
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
                  <FiX color="#888" size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  aria-label="Save"
                  disabled={updateLoading}
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
                  <FiCheck color="#888" size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ margin: 0 }}>{user.name}</h2>
              <div style={{ color: '#666' }}>{user.email}</div>
              {user.bio && <div style={{ color: '#444', marginTop: 6, fontSize: '1.05em' }}>{user.bio}</div>}
            </>
          )}
          {updateError && <div style={{ color: 'red', marginTop: 6 }}>{updateError}</div>}
        </div>
      </div>
      <h3 style={{ marginTop: '2rem' }}>My Posts</h3>
      {loading ? (
        <div>Loading posts...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          {deleteError && <div style={{ color: 'red', marginBottom: '1rem' }}>{deleteError}</div>}
          <PostList
            posts={posts.map(post => ({ ...post, createdAt: post.created_at }))}
            onEdit={handleEdit}
            onDelete={deleting ? (post => post.id === deleting ? () => {} : handleDelete(post)) : handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Profile; 