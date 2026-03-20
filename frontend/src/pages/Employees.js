import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '',username: '', email: '', password: '', phone: '', department: '' });

  const fetch = () => API.get(`/users?search=${search}`).then(r => setEmployees(r.data));
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetch(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', form);
      toast.success('Employee added!');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', phone: '', department: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return;
    await API.put(`/users/${id}/deactivate`);
    toast.success('Employee deactivated');
    fetch();
  };

  const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const btnStyle = (color) => ({ padding: '8px 16px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3a5f' }}>👥 Employees</h2>
        <button style={btnStyle('#1e3a5f')} onClick={() => setShowForm(!showForm)}>+ Add Employee</button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Add New Employee</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input 
  style={inputStyle} 
  placeholder="Username *"    // ← Add this input
  value={form.username} 
  onChange={e => setForm({ ...form, username: e.target.value })} 
  required 
/>
            <input style={inputStyle} type="email" placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input style={inputStyle} type="password" placeholder="Password *" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input style={{ ...inputStyle, gridColumn: 'span 2' }} placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" style={btnStyle('#27ae60')}>Add Employee</button>
              <button type="button" style={btnStyle('#7f8c8d')} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
        <input style={{ ...inputStyle, maxWidth: '300px' }} placeholder="🔍 Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
            <tr>
              {['Name', 'Username', 'Email', 'Phone', 'Department', 'Joined', 'Actions'].map(h => (
  <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => (
              <tr key={e._id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px' }}>{e.name}</td>
                <td style={{ padding: '10px 12px', color: '#1e3a5f', fontWeight: '600' }}>@{e.username}</td>
                <td style={{ padding: '10px 12px' }}>{e.email}</td>
                <td style={{ padding: '10px 12px' }}>{e.phone || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{e.department || '-'}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px' }}>
                  <button style={btnStyle('#e74c3c')} onClick={() => handleDeactivate(e._id)}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No employees found.</p>}
      </div>
    </div>
  );
};

export default Employees;