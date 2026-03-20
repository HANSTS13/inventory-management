import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Reports = () => {
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/stockin').then(r => setStockIn(r.data));
    API.get('/stockout').then(r => setStockOut(r.data));
    API.get('/products').then(r => setProducts(r.data));
  }, []);

  const totalStockInValue = stockIn.reduce((a, r) => a + r.quantity, 0);
  const totalStockOutValue = stockOut.reduce((a, r) => a + r.quantity, 0);

  const topProducts = [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 8);

  const cardStyle = (color) => ({ backgroundColor: color, color: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', flex: 1 });

  return (
    <div>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>📊 Reports</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={cardStyle('#1e3a5f')}><h3 style={{ fontSize: '30px', margin: 0 }}>{products.length}</h3><p>Total Products</p></div>
        <div style={cardStyle('#27ae60')}><h3 style={{ fontSize: '30px', margin: 0 }}>{totalStockInValue}</h3><p>Total Units Received</p></div>
        <div style={cardStyle('#e74c3c')}><h3 style={{ fontSize: '30px', margin: 0 }}>{totalStockOutValue}</h3><p>Total Units Issued</p></div>
        <div style={cardStyle('#f39c12')}><h3 style={{ fontSize: '30px', margin: 0 }}>{stockIn.length}</h3><p>Stock-In Transactions</p></div>
        <div style={cardStyle('#8e44ad')}><h3 style={{ fontSize: '30px', margin: 0 }}>{stockOut.length}</h3><p>Stock-Out Transactions</p></div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Current Stock by Product (Top 8)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#1e3a5f" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#27ae60' }}>Recent Stock In (Last 10)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Qty</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
            </tr></thead>
            <tbody>
              {stockIn.slice(0, 10).map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{r.product?.name}</td>
                  <td style={{ padding: '8px', color: '#27ae60', fontWeight: 'bold' }}>+{r.quantity}</td>
                  <td style={{ padding: '8px' }}>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#e74c3c' }}>Recent Stock Out (Last 10)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Product</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Qty</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Issued To</th>
            </tr></thead>
            <tbody>
              {stockOut.slice(0, 10).map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{r.product?.name}</td>
                  <td style={{ padding: '8px', color: '#e74c3c', fontWeight: 'bold' }}>-{r.quantity}</td>
                  <td style={{ padding: '8px' }}>{r.issuedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;