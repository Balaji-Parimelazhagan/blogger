import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <>
    <header style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)', background: '#fff', marginBottom: 0 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 2.5rem 2.5rem 2.5rem', maxWidth: 900, margin: '0 auto' }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-1px', color: '#2563eb', textDecoration: 'none' }}>Bloggr</Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#111', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <a href="#" style={{ color: '#111', textDecoration: 'none', fontWeight: 500 }}>Our Story</a>
          <a href="#" style={{ color: '#111', textDecoration: 'none', fontWeight: 500 }}>Membership</a>
          <Link to="/posts/new">
            <button style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 999, padding: '0.5em 1.5em', fontWeight: 600, marginLeft: 8, marginRight: 8, cursor: 'pointer' }}>Write</button>
          </Link>
          <Link to="/login">
            <button style={{ background: '#fff', color: '#111', border: '1.5px solid #111', borderRadius: 999, padding: '0.5em 1.5em', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
          </Link>
        </div>
      </nav>
    </header>
    <main className="container">
      <Outlet />
    </main>
  </>
);

export default Layout; 