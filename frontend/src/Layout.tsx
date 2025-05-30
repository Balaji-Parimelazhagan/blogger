import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <>
    <header className="card" style={{ marginBottom: 0 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-1px' }}>Bloggr</Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </header>
    <main className="container">
      <Outlet />
    </main>
  </>
);

export default Layout; 