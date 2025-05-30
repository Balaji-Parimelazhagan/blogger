import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
  showNameField?: boolean;
}

const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  loading = false,
  error = null,
  submitLabel = 'Submit',
  showNameField = true,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);

  const isValid =
    (!showNameField || name.trim().length > 1) &&
    validateEmail(email) &&
    password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    setFormError(null);
    if (!isValid) {
      setFormError('Please fill all fields correctly.');
      return;
    }
    try {
      await onSubmit({ name, email, password });
    } catch (err: any) {
      setFormError(err.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {showNameField && (
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Name</label><br />
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
            required
            minLength={2}
            style={{ width: '100%', padding: '0.5em' }}
            disabled={loading}
          />
          {touched.name && name.trim().length < 2 && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>Name must be at least 2 characters.</div>
          )}
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email</label><br />
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
          required
          style={{ width: '100%', padding: '0.5em' }}
          disabled={loading}
        />
        {touched.email && !validateEmail(email) && (
          <div style={{ color: 'red', fontSize: '0.9em' }}>Enter a valid email address.</div>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password</label><br />
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, password: true }))}
          required
          minLength={6}
          style={{ width: '100%', padding: '0.5em' }}
          disabled={loading}
        />
        {touched.password && password.length < 6 && (
          <div style={{ color: 'red', fontSize: '0.9em' }}>Password must be at least 6 characters.</div>
        )}
      </div>
      {(formError || error) && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{formError || error}</div>
      )}
      <button type="submit" disabled={loading || !isValid} style={{ width: '100%' }}>
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};

export default UserForm; 