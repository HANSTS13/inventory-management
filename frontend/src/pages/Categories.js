import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetch = () => API.get('/categories').then(r => setCategories(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', form);
      toast.success('Category added!');
      setForm({ name: '', description: '' });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await API.delete(`/categories/${id}`);
    toast.success('Deleted!');
    fetch();
  };

  const inputStyle = { padding: '8px 12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

  return (
    <div>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>🗂️ Categories</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>Add Category</h3>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Category Name</label>
            <input style={{ ...inputStyle, marginBottom: '12px', marginTop: '4px' }} placeholder="e.g. Electronics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label style={{ fontSize: '13px', fontWeight: '600' }}>Description</label>
            <input style={{ ...inputStyle, marginBottom: '16px', marginTop: '4px' }} placeholder="Optional description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>+ Add Category</button>
          </form>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              <tr>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Description</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c._id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{c.name}</td>
                  <td style={{ padding: '12px', color: '#666' }}>{c.description || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleDelete(c._id)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No categories yet. Add one!</p>}
        </div>
      </div>
    </div>
  );
};

export default Categories;