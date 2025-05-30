import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import UserForm from '../components/UserForm';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const ProfileEdit: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const navigate = useNavigate();

  if (!user) return null;

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateUser(user.id, { name: data.name, avatarUrl, bio });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Edit Profile</h2>
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>Profile updated! Redirecting...</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); handleSubmit({ name, email: user.email, password: '' }); }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Name</label><br />
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={2}
              style={{ width: '100%', padding: '0.5em' }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="avatarUrl">Avatar URL</label><br />
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              style={{ width: '100%', padding: '0.5em' }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="bio">Bio</label><br />
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.5em' }}
              disabled={loading}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <button type="submit" disabled={loading || name.trim().length < 2} style={{ width: '100%' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfileEdit; 