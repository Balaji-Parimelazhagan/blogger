import React from 'react';

const Login: React.FC = () => (
  <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
    <h2>Login</h2>
    <form>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email</label><br />
        <input id="email" type="email" name="email" required style={{ width: '100%', padding: '0.5em' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password</label><br />
        <input id="password" type="password" name="password" required style={{ width: '100%', padding: '0.5em' }} />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);

export default Login; 