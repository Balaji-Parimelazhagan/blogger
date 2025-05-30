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
  const [showPassword, setShowPassword] = useState(false);
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

  const inputStyle = {
    width: '100%',
    padding: '0.95em 1em',
    borderRadius: 12,
    border: '1.5px solid #cbd5e1',
    fontSize: '1.08em',
    marginTop: '0.3em',
    marginBottom: '0.1em',
    outline: 'none',
    background: '#f9fafb',
    transition: 'border 0.2s',
  } as React.CSSProperties;

  const inputFocusStyle = {
    border: '1.5px solid #2563eb',
    background: '#fff',
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      {showNameField && (
        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="name" style={{ fontWeight: 500, fontSize: '1em' }}>Name</label><br />
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
            required
            minLength={2}
            style={inputStyle}
            disabled={loading}
          />
          {touched.name && name.trim().length < 2 && (
            <div style={{ color: 'red', fontSize: '0.93em', marginTop: 2 }}>Name must be at least 2 characters.</div>
          )}
        </div>
      )}
      <div style={{ marginBottom: '1.2rem' }}>
        <label htmlFor="email" style={{ fontWeight: 500, fontSize: '1em' }}>Email</label><br />
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
          required
          style={inputStyle}
          disabled={loading}
        />
        {touched.email && !validateEmail(email) && (
          <div style={{ color: 'red', fontSize: '0.93em', marginTop: 2 }}>Enter a valid email address.</div>
        )}
      </div>
      <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
        <label htmlFor="password" style={{ fontWeight: 500, fontSize: '1em' }}>Password</label><br />
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, password: true }))}
          required
          minLength={6}
          style={inputStyle}
          disabled={loading}
        />
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: 38,
            fontSize: '0.98em',
            color: '#2563eb',
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: 500,
          }}
          onClick={() => setShowPassword(v => !v)}
        >
          {showPassword ? 'hide' : 'show'}
        </span>
        {touched.password && password.length < 6 && (
          <div style={{ color: 'red', fontSize: '0.93em', marginTop: 2 }}>Password must be at least 6 characters.</div>
        )}
      </div>
      {(formError || error) && (
        <div style={{ color: 'red', marginBottom: '1.2rem', fontWeight: 500 }}>{formError || error}</div>
      )}
      <button
        type="submit"
        disabled={loading || !isValid}
        style={{
          width: '100%',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 999,
          fontWeight: 700,
          fontSize: '1.13em',
          padding: '0.95em 0',
          marginTop: '0.2em',
          marginBottom: '0.7em',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
          cursor: loading || !isValid ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};

export default UserForm; 