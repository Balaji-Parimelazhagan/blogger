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
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>Login successful! Redirecting...</div>
      ) : (
        <UserForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          submitLabel="Login"
          showNameField={false}
        />
      )}
    </div>
  );
};

export default Login; 