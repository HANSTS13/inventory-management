import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { path: '/dashboard', label: '🏠 Dashboard', adminOnly: false },
    { path: '/products', label: '📦 Products', adminOnly: false },
    { path: '/categories', label: '🗂️ Categories', adminOnly: false },
    { path: '/stockin', label: '📥 Stock In', adminOnly: false },
    { path: '/stockout', label: '📤 Stock Out', adminOnly: false },
    { path: '/employees', label: '👥 Employees', adminOnly: true },
    { path: '/reports', label: '📊 Reports', adminOnly: true },
  ];

  const styles = {
    sidebar: { width: '250px', minHeight: '100vh', backgroundColor: '#1e3a5f', color: 'white', padding: '0', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column' },
    header: { padding: '20px', backgroundColor: '#152d4a', borderBottom: '1px solid #2d5a8e' },
    title: { margin: 0, fontSize: '18px', fontWeight: 'bold' },
    role: { fontSize: '12px', color: '#7fb3d3', marginTop: '4px' },
    nav: { flex: 1, padding: '10px 0' },
    link: { display: 'block', padding: '12px 20px', color: 'white', textDecoration: 'none', fontSize: '14px', borderLeft: '3px solid transparent', transition: 'all 0.2s' },
    activeLink: { backgroundColor: '#2d5a8e', borderLeft: '3px solid #4da6ff' },
    logoutBtn: { margin: '10px', padding: '10px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <p style={styles.title}>📋 Inventory MS</p>
        <p style={styles.role}>{user?.name} ({user?.role})</p>
      </div>
      <nav style={styles.nav}>
        {links.filter(l => !l.adminOnly || user?.role === 'admin').map(link => (
          <Link key={link.path} to={link.path} style={{ ...styles.link, ...(location.pathname === link.path ? styles.activeLink : {}) }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
};

export default Sidebar;