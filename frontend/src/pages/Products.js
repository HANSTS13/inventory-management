import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', category: '', description: '', unit: 'pcs', lowStockThreshold: 10, supplier: '', price: 0, manufacturingDate: '', expiryDate: '' });

  const fetchProducts = () => {
    let url = `/products?sort=${sortBy}`;
    if (search) url += `&search=${search}`;
    if (categoryFilter) url += `&category=${categoryFilter}`;
    API.get(url).then(r => setProducts(r.data));
  };

  useEffect(() => { fetchProducts(); }, [search, categoryFilter, sortBy]);
  useEffect(() => { API.get('/categories').then(r => setCategories(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', form);
      toast.success('Product added!');
      setShowForm(false);
      setForm({ name: '', sku: '', category: '', description: '', unit: 'pcs', lowStockThreshold: 10, supplier: '', price: 0, manufacturingDate: '', expiryDate: '' });
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    toast.success('Deleted!');
    fetchProducts();
  };

  const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '13px' };
  const btnStyle = (color) => ({ padding: '8px 16px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3a5f' }}>📦 Products</h2>
        <button style={btnStyle('#1e3a5f')} onClick={() => setShowForm(!showForm)}>+ Add Product</button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '10px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Add New Product</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input style={inputStyle} placeholder="Product Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={inputStyle} placeholder="SKU *" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
            <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select Category *</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input style={inputStyle} placeholder="Unit (pcs, kg, L...)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            <input style={inputStyle} placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input style={inputStyle} type="number" placeholder="Low Stock Threshold" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: e.target.value })} />
            <input style={inputStyle} type="date" placeholder="Manufacturing Date" value={form.manufacturingDate} onChange={e => setForm({ ...form, manufacturingDate: e.target.value })} />
            <input style={inputStyle} type="date" placeholder="Expiry Date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
            <input style={{ ...inputStyle, gridColumn: 'span 2' }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" style={btnStyle('#27ae60')}>Save Product</button>
              <button type="button" style={btnStyle('#7f8c8d')} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: '200px' }} placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={inputStyle} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select style={inputStyle} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="-createdAt">Newest First</option>
          <option value="name">Name A-Z</option>
          <option value="-quantity">Most Stock</option>
          <option value="quantity">Least Stock</option>
          <option value="expiryDate">Expiry Date</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
            <tr>
              {['Name', 'SKU', 'Category', 'Quantity', 'Unit', 'Supplier', 'Expiry Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 12px' }}>{p.name}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#666' }}>{p.sku}</td>
                <td style={{ padding: '10px 12px' }}>{p.category?.name}</td>
                <td style={{ padding: '10px 12px', fontWeight: 'bold', color: p.quantity <= p.lowStockThreshold ? '#e74c3c' : '#27ae60' }}>{p.quantity}</td>
                <td style={{ padding: '10px 12px' }}>{p.unit}</td>
                <td style={{ padding: '10px 12px' }}>{p.supplier}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px' }}>{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '10px 12px' }}>
                  {p.quantity <= p.lowStockThreshold && <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>Low</span>}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <button style={btnStyle('#e74c3c')} onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No products found.</p>}
      </div>
    </div>
  );
};

export default Products;