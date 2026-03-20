import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);

  useEffect(() => {
    API.get('/products').then(r => setProducts(r.data));
    API.get('/products?lowStock=true').then(r => setLowStock(r.data));
    API.get('/products?expiring=true').then(r => setExpiring(r.data));
  }, []);

  const cardStyle = (color) => ({
    backgroundColor: color, color: 'white', padding: '24px', borderRadius: '10px',
    minWidth: '160px', flex: 1, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  });

  const alertStyle = (color) => ({
    backgroundColor: color, border: `1px solid ${color}`, borderRadius: '8px',
    padding: '16px', marginBottom: '10px'
  });

  return (
    <div>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>📊 Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={cardStyle('#1e3a5f')}>
          <h3 style={{ fontSize: '36px', margin: '0' }}>{products.length}</h3>
          <p style={{ margin: '4px 0 0' }}>Total Products</p>
        </div>
        <div style={cardStyle('#e74c3c')}>
          <h3 style={{ fontSize: '36px', margin: '0' }}>{lowStock.length}</h3>
          <p style={{ margin: '4px 0 0' }}>Low Stock Items</p>
        </div>
        <div style={cardStyle('#f39c12')}>
          <h3 style={{ fontSize: '36px', margin: '0' }}>{expiring.length}</h3>
          <p style={{ margin: '4px 0 0' }}>Expiring Soon</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#e74c3c' }}>🔴 Low Stock Alerts</h3>
          {lowStock.map(p => (
            <div key={p._id} style={alertStyle('#fff5f5')}>
              <strong>{p.name}</strong> (SKU: {p.sku}) — Only <strong>{p.quantity} {p.unit}</strong> left (Threshold: {p.lowStockThreshold})
            </div>
          ))}
        </div>
      )}

      {expiring.length > 0 && (
        <div>
          <h3 style={{ color: '#f39c12' }}>⚠️ Expiring Soon (within 30 days)</h3>
          {expiring.map(p => (
            <div key={p._id} style={alertStyle('#fffbeb')}>
              <strong>{p.name}</strong> — Expires on <strong>{new Date(p.expiryDate).toLocaleDateString()}</strong>
            </div>
          ))}
        </div>
      )}

      {lowStock.length === 0 && expiring.length === 0 && (
        <div style={{ backgroundColor: '#d4edda', padding: '16px', borderRadius: '8px', color: '#155724' }}>
          ✅ All stocks are at healthy levels. No alerts!
        </div>
      )}
    </div>
  );
};

export default Dashboard;