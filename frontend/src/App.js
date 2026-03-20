import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import StockInPage from './pages/StockIn';
import StockOutPage from './pages/StockOut';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{
        marginLeft: '250px',
        padding: '20px',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <AlertBanner />
        <Navbar />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
          <Route path="/stockin" element={<ProtectedRoute><Layout><StockInPage /></Layout></ProtectedRoute>} />
          <Route path="/stockout" element={<ProtectedRoute><Layout><StockOutPage /></Layout></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute adminOnly><Layout><Employees /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute adminOnly><Layout><Reports /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;