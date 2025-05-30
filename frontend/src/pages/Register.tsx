import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      await register(data.name, data.email, data.password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Register</h2>
      {success ? (
        <div style={{ color: 'green', marginBottom: '1rem' }}>Registration successful! Redirecting...</div>
      ) : (
        <UserForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
          submitLabel="Register"
          showNameField={true}
        />
      )}
    </div>
  );
};

export default Register; 