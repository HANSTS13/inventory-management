import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const routes = {
      '/dashboard': '🏠 Dashboard',
      '/products': '📦 Products',
      '/categories': '🗂️ Categories',
      '/stockin': '📥 Stock In',
      '/stockout': '📤 Stock Out',
      '/employees': '👥 Employees',
      '/reports': '📊 Reports',
    };
    return routes[location.pathname] || '📋 Inventory Management';
  };

  const styles = {
    navbar: {
      backgroundColor: 'white',
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: '24px',
      borderRadius: '10px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1e3a5f',
      margin: 0
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#1e3a5f',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    userRole: {
      fontSize: '11px',
      color: '#888',
      textTransform: 'capitalize'
    },
    roleBadge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 'bold',
      backgroundColor: user?.role === 'admin' ? '#1e3a5f' : '#27ae60',
      color: 'white',
      textTransform: 'uppercase'
    },
    date: {
      fontSize: '12px',
      color: '#888'
    }
  };

  return (
    <div style={styles.navbar}>
      {/* Left: Page Title */}
      <h1 style={styles.title}>{getPageTitle()}</h1>

      {/* Right: User Info */}
      <div style={styles.rightSection}>
        {/* Current Date */}
        <span style={styles.date}>
          📅 {new Date().toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>

        {/* Role Badge */}
        <span style={styles.roleBadge}>
          {user?.role === 'admin' ? '👑 Admin' : '👤 Employee'}
        </span>

        {/* User Avatar and Name */}
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;