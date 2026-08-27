import React, { useEffect, useState } from 'react';
import API_BASE_URL from '@/config/api';

const StockMenuTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  const fetchMenu = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/menu`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleEdit = (itemId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const handleSave = async (item) => {
    const changes = edits[item.itemId];
    if (!changes) return;
    setSaving((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/menu/${item.itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });
      if (res.ok) {
        setEdits((prev) => { const e = { ...prev }; delete e[item.itemId]; return e; });
        fetchMenu();
      }
    } finally {
      setSaving((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const filtered = items.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading menu…</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Stock &amp; Menu Management</h1>
        <input
          type="text"
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: 6,
            fontSize: '.82rem',
            background: 'var(--admin-bg)',
            color: 'var(--admin-text)',
            width: 200,
          }}
        />
      </div>

      <div className="section-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="admin-empty">No items found.</td></tr>
            ) : (
              filtered.map((item) => {
                const edit = edits[item.itemId] || {};
                const isDirty = !!edits[item.itemId];
                return (
                  <tr key={item.itemId}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: 'var(--admin-muted)' }}>{item.category || '—'}</td>
                    <td>
                      <input
                        type="number"
                        defaultValue={item.price}
                        value={edit.price !== undefined ? edit.price : item.price}
                        min={0}
                        step={0.5}
                        onChange={(e) => handleEdit(item.itemId, 'price', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        defaultValue={item.stock}
                        value={edit.stock !== undefined ? edit.stock : item.stock}
                        min={0}
                        onChange={(e) => handleEdit(item.itemId, 'stock', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        disabled={!isDirty || saving[item.itemId]}
                        onClick={() => handleSave(item)}
                        style={{ opacity: isDirty ? 1 : 0.4 }}
                      >
                        {saving[item.itemId] ? 'Saving…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMenuTab;
