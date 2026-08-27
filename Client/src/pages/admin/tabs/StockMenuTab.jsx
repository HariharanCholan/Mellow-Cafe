import React, { useEffect, useState } from 'react';
import API_BASE_URL, { authFetch } from '@/config/api';
import { Plus, Trash2, X, Check, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'hot-cold', name: 'Hot & Cold Beverages' },
  { id: 'starters', name: 'Starters' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'pizzas', name: 'Pizzas' },
  { id: 'cakes', name: 'Cakes' },
  { id: 'pies', name: 'Pies' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'cakes-brownies', name: 'Cakes & Brownies' },
  { id: 'dry-cakes', name: 'Dry Cakes' },
  { id: 'cookies', name: 'Cookies' },
  { id: 'doughnuts-rolls', name: 'Doughnuts & Rolls' },
  { id: 'breads', name: 'Breads' },
];

const StockMenuTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [search, setSearch] = useState('');
  const [saveMsg, setSaveMsg] = useState({});

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    categoryId: 'hot-cold',
    price: '',
    stock: 50,
    size: '',
    options: '',
  });
  const [addingItem, setAddingItem] = useState(false);
  const [addError, setAddError] = useState(null);

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

  const handleDeleteItem = async (itemId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }
    try {
      const res = await authFetch(`${API_BASE_URL}/api/admin/menu/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMenu();
      } else {
        const err = await res.json();
        alert(`Failed to delete: ${err.message}`);
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.categoryId || !newItem.price) {
      setAddError('Please fill in Name, Category, and Price.');
      return;
    }
    setAddingItem(true);
    setAddError(null);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/admin/menu`, {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add item');
      }
      setShowAddModal(false);
      setNewItem({
        name: '',
        categoryId: 'hot-cold',
        price: '',
        stock: 50,
        size: '',
        options: '',
      });
      fetchMenu();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddingItem(false);
    }
  };

  const filtered = items.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.categoryId?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading menu…</div>;
  if (error) return (
    <div className="admin-empty">
      <p>⚠️ Could not load menu items: {error}</p>
      <p style={{ marginTop: 8, fontSize: '.8rem' }}>Make sure the database has been seeded.</p>
    </div>
  );

  return (
    <div>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Stock &amp; Menu Management
          <span style={{ color: 'var(--admin-muted)', fontWeight: 400, marginLeft: 8 }}>({filtered.length} items)</span>
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              width: 200,
            }}
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px' }}
          >
            <Plus className="w-4 h-4" /> Add New Item
          </button>
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 12,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            border: '1px solid var(--admin-border)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#faf9f7',
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)' }}>
                ➕ Add New Menu Item
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--admin-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {addError && (
                <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: 6, fontSize: '.8rem' }}>
                  {addError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                  ITEM NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazelnut Frappe"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    fontSize: '.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                  CATEGORY *
                </label>
                <select
                  value={newItem.categoryId}
                  onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    fontSize: '.85rem',
                    background: '#fff',
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                    PRICE (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.5}
                    placeholder="120"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 6,
                      fontSize: '.85rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                    STOCK
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="50"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 6,
                      fontSize: '.85rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                    SIZE (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1/2 Kg, Large"
                    value={newItem.size}
                    onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 6,
                      fontSize: '.85rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: 4 }}>
                    OPTIONS / FLAVORS
                  </label>
                  <input
                    type="text"
                    placeholder="Comma-separated e.g. Vanilla, Chocolate"
                    value={newItem.options}
                    onChange={(e) => setNewItem({ ...newItem, options: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 6,
                      fontSize: '.85rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingItem}
                  className="btn-primary"
                  style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {addingItem ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Table */}
      {items.length === 0 ? (
        <div className="admin-empty" style={{ padding: '48px 24px' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🍽️</p>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>No menu items found in the database.</p>
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
                      <td style={{ fontWeight: 500 }}>
                        {item.name}
                        {item.size && <span style={{ fontSize: '.72rem', color: 'var(--admin-muted)', marginLeft: 6 }}>({item.size})</span>}
                      </td>
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

                          <button
                            onClick={() => handleDeleteItem(item.itemId, item.name)}
                            title="Delete Item"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: 4,
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
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
