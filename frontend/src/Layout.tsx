import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Avatar from './components/Avatar';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
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
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', position: 'relative' }} ref={dropdownRef}>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setDropdownOpen(v => !v)}>
                  <Avatar name={user.name} avatarUrl={user.avatarUrl} size={38} />
                </div>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: 48, right: 0, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, boxShadow: '0 4px 24px rgba(37,99,235,0.07)', minWidth: 180, zIndex: 100, padding: '0.7rem 0.5rem' }}>
                    <div style={{ padding: '0.7rem 1rem', fontWeight: 700, color: '#2563eb', fontSize: '1.08em', borderBottom: '1px solid #f1f1f1' }}>{user.name}</div>
                    <Link to="/profile" style={{ display: 'block', padding: '0.7rem 1rem', color: '#222', textDecoration: 'none', fontWeight: 500 }}>Profile</Link>
                    <Link to="/settings" style={{ display: 'block', padding: '0.7rem 1rem', color: '#222', textDecoration: 'none', fontWeight: 500 }}>Settings</Link>
                    <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }} style={{ width: '100%', background: '#fff', color: '#d32f2f', border: 'none', borderTop: '1px solid #f1f1f1', borderRadius: 0, padding: '0.7rem 1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button style={{ background: '#fff', color: '#111', border: '1.5px solid #111', borderRadius: 999, padding: '0.5em 1.5em', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default Layout; 