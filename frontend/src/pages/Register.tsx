import React from 'react';

const Register: React.FC = () => (
  <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
    <h2>Register</h2>
    <form>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Name</label><br />
        <input id="name" type="text" name="name" required style={{ width: '100%', padding: '0.5em' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email</label><br />
        <input id="email" type="email" name="email" required style={{ width: '100%', padding: '0.5em' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Password</label><br />
        <input id="password" type="password" name="password" required style={{ width: '100%', padding: '0.5em' }} />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
);

export default Register; 