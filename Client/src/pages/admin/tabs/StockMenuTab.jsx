import React, { useEffect, useState } from 'react';
import API_BASE_URL, { authFetch } from '@/config/api';

const StockMenuTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [search, setSearch] = useState('');
  const [saveMsg, setSaveMsg] = useState({});

  const fetchMenu = () => {
    setLoading(true);
    authFetch(`${API_BASE_URL}/api/admin/menu`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Menu fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleEdit = (itemId, field, value) => {
    setEdits((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [field]: value } }));
  };

  const handleSave = async (item) => {
    const changes = edits[item.itemId];
    if (!changes) return;
    setSaving((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      const res = await authFetch(`${API_BASE_URL}/api/admin/menu/${item.itemId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
      });
      if (res.ok) {
        setEdits((prev) => { const e = { ...prev }; delete e[item.itemId]; return e; });
        setSaveMsg((prev) => ({ ...prev, [item.itemId]: '✓ Saved' }));
        setTimeout(() => setSaveMsg((prev) => { const m = { ...prev }; delete m[item.itemId]; return m; }), 2000);
        fetchMenu();
      } else {
        const err = await res.json();
        setSaveMsg((prev) => ({ ...prev, [item.itemId]: `⚠ ${err.message}` }));
      }
    } catch (err) {
      setSaveMsg((prev) => ({ ...prev, [item.itemId]: '⚠ Error' }));
    } finally {
      setSaving((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const filtered = items.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.categoryId?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading menu…</div>;
  if (error)   return (
    <div className="admin-empty">
      <p>⚠️ Could not load menu items: {error}</p>
      <p style={{ marginTop: 8, fontSize: '.8rem' }}>Make sure the database has been seeded. Run: <code>node Server/scripts/seedMenu.cjs</code></p>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Stock &amp; Menu Management
          <span style={{ color: 'var(--admin-muted)', fontWeight: 400, marginLeft: 8 }}>({filtered.length} items)</span>
        </h1>
        <input
          type="text"
          placeholder="Search items or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: 6,
            fontSize: '.82rem',
            background: 'var(--admin-bg)',
            color: 'var(--admin-text)',
            width: 220,
          }}
        />
      </div>

      {items.length === 0 ? (
        <div className="admin-empty" style={{ padding: '48px 24px' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🍽️</p>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>No menu items found in the database.</p>
          <p style={{ fontSize: '.82rem', color: 'var(--admin-muted)' }}>
            Run the seed script to populate the menu:<br />
            <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
              node Server/scripts/seedMenu.cjs
            </code>
          </p>
        </div>
      ) : (
        <div className="section-card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="admin-empty">No items match your search.</td></tr>
              ) : (
                filtered.map((item) => {
                  const edit = edits[item.itemId] || {};
                  const isDirty = !!edits[item.itemId];
                  return (
                    <tr key={item.itemId}>
                      <td style={{ color: 'var(--admin-muted)', fontSize: '.75rem' }}>{item.itemId}</td>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td>
                        <span style={{
                          background: 'var(--admin-accent-light)',
                          color: 'var(--admin-accent)',
                          borderRadius: 999,
                          padding: '2px 8px',
                          fontSize: '.72rem',
                          fontWeight: 600,
                        }}>
                          {item.categoryId || '—'}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={edit.price !== undefined ? edit.price : item.price}
                          min={0}
                          step={0.5}
                          onChange={(e) => handleEdit(item.itemId, 'price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={edit.stock !== undefined ? edit.stock : item.stock}
                          min={0}
                          onChange={(e) => handleEdit(item.itemId, 'stock', e.target.value)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            className="btn-primary"
                            disabled={!isDirty || saving[item.itemId]}
                            onClick={() => handleSave(item)}
                            style={{ opacity: isDirty ? 1 : 0.35 }}
                          >
                            {saving[item.itemId] ? 'Saving…' : 'Save'}
                          </button>
                          {saveMsg[item.itemId] && (
                            <span style={{ fontSize: '.75rem', color: saveMsg[item.itemId].startsWith('✓') ? '#059669' : '#dc2626' }}>
                              {saveMsg[item.itemId]}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockMenuTab;
