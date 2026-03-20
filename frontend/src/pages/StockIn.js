import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const StockIn = () => {
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product: '', quantity: '', supplier: '', invoiceNumber: '', remarks: '' });
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const fetchRecords = () => {
    let url = '/stockin?sort=-date';
    if (dateFilter.start && dateFilter.end) url += `&startDate=${dateFilter.start}&endDate=${dateFilter.end}`;
    API.get(url).then(r => setRecords(r.data));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchRecords(); }, [dateFilter]);
  useEffect(() => { API.get('/products').then(r => setProducts(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/stockin', form);
      toast.success('Stock In recorded!');
      setShowForm(false);
      setForm({ product: '', quantity: '', supplier: '', invoiceNumber: '', remarks: '' });
      fetchRecords();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (color) => ({ padding: '8px 16px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3a5f' }}>📥 Stock In</h2>
        <button style={btnStyle('#27ae60')} onClick={() => setShowForm(!showForm)}>+ Record Stock In</button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>New Stock In Entry</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select style={inputStyle} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} required>
              <option value="">Select Product *</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
            <input style={inputStyle} type="number" min="1" placeholder="Quantity *" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            <input style={inputStyle} placeholder="Supplier *" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} required />
            <input style={inputStyle} placeholder="Invoice Number" value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} />
            <input style={{ ...inputStyle, gridColumn: 'span 2' }} placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" style={btnStyle('#27ae60')}>Save</button>
              <button type="button" style={btnStyle('#7f8c8d')} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>Filter by date:</span>
        <input style={{ ...inputStyle, width: '150px' }} type="date" value={dateFilter.start} onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })} />
        <span>to</span>
        <input style={{ ...inputStyle, width: '150px' }} type="date" value={dateFilter.end} onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })} />
        <button style={btnStyle('#7f8c8d')} onClick={() => setDateFilter({ start: '', end: '' })}>Clear</button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#27ae60', color: 'white' }}>
            <tr>
              {['Date', 'Product', 'SKU', 'Qty', 'Supplier', 'Invoice No.', 'Received By', 'Remarks'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={r._id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>{new Date(r.date).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px' }}>{r.product?.name}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666' }}>{r.product?.sku}</td>
                <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#27ae60' }}>+{r.quantity}</td>
                <td style={{ padding: '10px 12px' }}>{r.supplier}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>{r.invoiceNumber || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{r.receivedBy?.name}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666' }}>{r.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No stock-in records found.</p>}
      </div>
    </div>
  );
};

export default StockIn;