import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <div style={{
        background: '#fff',
        borderRadius: 28,
        border: '1.5px solid #e5e7eb',
        boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
        padding: '1.7rem 1.3rem 1.3rem 1.3rem',
        maxWidth: 400,
        width: '100%',
        margin: '2.2rem auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '-1px' }}>Sign in</h2>
        <div style={{ color: '#555', fontSize: '1.01rem', marginBottom: '1.1rem', fontWeight: 400 }}>Stay updated on your professional world</div>
        {success ? (
          <div style={{ color: 'green', marginBottom: '1.1rem', fontWeight: 600 }}>Login successful! Redirecting...</div>
        ) : (
          <UserForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            submitLabel="Sign in"
            showNameField={false}
          />
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1.1rem', fontSize: '1.01rem', color: '#444' }}>
        New to Bloggr?{' '}
        <a href="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Join now</a>
      </div>
      <style>{`
        @media (max-width: 600px) {
          main > div { padding: 1.2rem !important; }
        }
      `}</style>
    </main>
  );
};

export default Login; 