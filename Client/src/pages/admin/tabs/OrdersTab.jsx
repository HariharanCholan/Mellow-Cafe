import React, { useEffect, useState } from 'react';
import API_BASE_URL, { authFetch } from '@/config/api';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = (p = 1) => {
    setLoading(true);
    authFetch(`${API_BASE_URL}/api/admin/orders?page=${p}&limit=15`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Orders fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const fmt = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) return <div className="admin-loading">Loading orders…</div>;
  if (error)   return <div className="admin-empty">⚠️ Could not load orders: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Orders
          <span style={{ color: 'var(--admin-muted)', fontWeight: 400, marginLeft: 8 }}>({total} total)</span>
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty" style={{ padding: '48px 24px' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>📦</p>
          <p style={{ fontWeight: 600 }}>No orders yet.</p>
          <p style={{ fontSize: '.82rem', color: 'var(--admin-muted)', marginTop: 4 }}>Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <>
          <div className="section-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '.75rem', color: 'var(--admin-muted)' }}>
                      #{order._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td style={{ fontSize: '.8rem' }}>{order.userEmail || '—'}</td>
                    <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)', whiteSpace: 'nowrap' }}>
                      {fmt(order.timestamp || order.createdAt)}
                    </td>
                    <td>
                      {(order.items || []).slice(0, 2).map((item, i) => (
                        <span key={i} style={{ fontSize: '.77rem', display: 'block', color: 'var(--admin-text)' }}>
                          {item.name} × {item.quantity || 1}
                        </span>
                      ))}
                      {order.items?.length > 2 && (
                        <span style={{ fontSize: '.72rem', color: 'var(--admin-muted)' }}>
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{(order.total || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTab;
