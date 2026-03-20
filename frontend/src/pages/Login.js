import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const styles = {
    container: { 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#1e3a5f' 
    },
    card: { 
      backgroundColor: 'white', 
      padding: '40px', 
      borderRadius: '12px', 
      width: '380px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)' 
    },
    title: { 
      textAlign: 'center', 
      color: '#1e3a5f', 
      marginBottom: '8px', 
      fontSize: '26px' 
    },
    subtitle: { 
      textAlign: 'center', 
      color: '#666', 
      marginBottom: '30px', 
      fontSize: '14px' 
    },
    label: { 
      display: 'block', 
      marginBottom: '6px', 
      fontWeight: '600', 
      color: '#333', 
      fontSize: '14px' 
    },
    input: { 
      width: '100%', 
      padding: '10px 12px', 
      borderRadius: '6px', 
      border: '1px solid #ddd', 
      fontSize: '14px', 
      marginBottom: '16px', 
      boxSizing: 'border-box', 
      outline: 'none' 
    },
    button: { 
      width: '100%', 
      padding: '12px', 
      backgroundColor: '#1e3a5f', 
      color: 'white', 
      border: 'none', 
      borderRadius: '6px', 
      fontSize: '16px', 
      cursor: 'pointer', 
      fontWeight: 'bold' 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📋 Inventory MS</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Username</label>
          <input 
            style={styles.input} 
            type="text" 
            value={form.username} 
            onChange={e => setForm({ ...form, username: e.target.value })} 
            placeholder="Enter your username" 
            required 
          />
          <label style={styles.label}>Password</label>
          <input 
            style={styles.input} 
            type="password" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            placeholder="Enter your password" 
            required 
          />
          <button 
            style={styles.button} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;