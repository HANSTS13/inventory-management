import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AlertBanner = () => {
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    API.get('/products?lowStock=true').then(r => setLowStock(r.data)).catch(() => {});
    API.get('/products?expiring=true').then(r => setExpiring(r.data)).catch(() => {});
  }, []);

  if (!show) return null;
  if (lowStock.length === 0 && expiring.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '250px',
      right: '0',
      zIndex: 1000,
      padding: '0'
    }}>
      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px'
        }}>
          <div>
            🔴 <strong>Low Stock Alert:</strong>{' '}
            {lowStock.slice(0, 3).map((p, i) => (
              <span key={p._id}>
                {p.name} ({p.quantity} {p.unit} left)
                {i < Math.min(lowStock.length, 3) - 1 ? ', ' : ''}
              </span>
            ))}
            {lowStock.length > 3 && <span> and {lowStock.length - 3} more...</span>}
          </div>
          <button
            onClick={() => setShow(false)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Expiry Alert */}
      {expiring.length > 0 && (
        <div style={{
          backgroundColor: '#f39c12',
          color: 'white',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px'
        }}>
          <div>
            ⚠️ <strong>Expiring Soon:</strong>{' '}
            {expiring.slice(0, 3).map((p, i) => (
              <span key={p._id}>
                {p.name} (expires {new Date(p.expiryDate).toLocaleDateString()})
                {i < Math.min(expiring.length, 3) - 1 ? ', ' : ''}
              </span>
            ))}
            {expiring.length > 3 && <span> and {expiring.length - 3} more...</span>}
          </div>
          <button
            onClick={() => setShow(false)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertBanner;