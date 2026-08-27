import React, { useEffect, useState } from 'react';
import API_BASE_URL, { authFetch } from '@/config/api';

const VALID_ROLES = ['worker', 'staff', 'admin', 'super_admin'];

const AccessRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleMap, setRoleMap] = useState({});
  const [working, setWorking] = useState({});
  const [actionMsg, setActionMsg] = useState({});

  const fetchRequests = () => {
    setLoading(true);
    authFetch(`${API_BASE_URL}/api/admin/requests`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} – you may not have super_admin access`);
        return r.json();
      })
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Requests fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, action) => {
    setWorking((prev) => ({ ...prev, [id]: true }));
    try {
      const body = action === 'approve' ? { role: roleMap[id] || 'staff' } : {};
      const res = await authFetch(`${API_BASE_URL}/api/admin/requests/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg((prev) => ({ ...prev, [id]: `✓ ${data.message}` }));
        fetchRequests();
      } else {
        setActionMsg((prev) => ({ ...prev, [id]: `⚠ ${data.message}` }));
      }
    } catch (err) {
      setActionMsg((prev) => ({ ...prev, [id]: '⚠ Network error' }));
    } finally {
      setWorking((prev) => ({ ...prev, [id]: false }));
    }
  };

  const fmt = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (loading) return <div className="admin-loading">Loading requests…</div>;
  if (error)   return <div className="admin-empty">⚠️ {error}</div>;

  const pending = requests.filter((r) => r.status === 'pending');
  const others  = requests.filter((r) => r.status !== 'pending');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
          Access Requests
          {pending.length > 0 && (
            <span style={{
              background: '#92400e', color: '#fff', borderRadius: 999,
              fontSize: '.7rem', padding: '2px 8px', marginLeft: 8, fontWeight: 600,
            }}>
              {pending.length} pending
            </span>
          )}
        </h1>
      </div>

      {/* Pending requests */}
      {pending.length === 0 ? (
        <div className="section-card">
          <div className="admin-empty" style={{ padding: '32px 0' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅</p>
            <p style={{ fontWeight: 600 }}>No pending requests.</p>
          </div>
        </div>
      ) : (
        <div className="section-card">
          <h2>⏳ Pending Requests</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Requested</th>
                <th>Assign Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((req) => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.name}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)' }}>{req.email}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)', maxWidth: 180 }}>{req.reason || '—'}</td>
                  <td style={{ fontSize: '.75rem', color: 'var(--admin-muted)', whiteSpace: 'nowrap' }}>{fmt(req.createdAt)}</td>
                  <td>
                    <select
                      value={roleMap[req._id] || 'staff'}
                      onChange={(e) => setRoleMap((prev) => ({ ...prev, [req._id]: e.target.value }))}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid var(--admin-border)',
                        borderRadius: 5,
                        fontSize: '.8rem',
                        background: 'var(--admin-bg)',
                        color: 'var(--admin-text)',
                      }}
                    >
                      {VALID_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="btn-primary"
                        disabled={working[req._id]}
                        onClick={() => handleAction(req._id, 'approve')}
                      >
                        {working[req._id] ? '…' : 'Approve'}
                      </button>
                      <button
                        className="btn-danger"
                        disabled={working[req._id]}
                        onClick={() => handleAction(req._id, 'reject')}
                      >
                        Reject
                      </button>
                      {actionMsg[req._id] && (
                        <span style={{ fontSize: '.75rem', color: actionMsg[req._id].startsWith('✓') ? '#059669' : '#dc2626' }}>
                          {actionMsg[req._id]}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* History */}
      <div className="section-card">
        <h2>📋 Request History</h2>
        {others.length === 0 ? (
          <div className="admin-empty">No past requests.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assigned Role</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {others.map((req) => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.name}</td>
                  <td style={{ fontSize: '.78rem', color: 'var(--admin-muted)' }}>{req.email}</td>
                  <td><span className={`badge badge-${req.status}`}>{req.status}</span></td>
                  <td style={{ fontSize: '.78rem' }}>{req.assignedRole || '—'}</td>
                  <td style={{ fontSize: '.75rem', color: 'var(--admin-muted)' }}>{fmt(req.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AccessRequestsTab;
