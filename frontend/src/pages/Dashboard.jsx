import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiGet } from '../utils/api';
export default function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const token = useSelector(state => state.auth.token);
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadLeads() {
      try {
        setLoading(true);
        setError('');
        const data = token ? await apiGet('/api/leads/my') : await apiGet('/api/leads/recent');
        if (!cancelled) setLeads(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load enquiries');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (activeTab === 'enquiries') loadLeads();
    return () => { cancelled = true; };
  }, [activeTab, token]);

  const statusLabel = (s) => {
    const map = {
      new: 'New',
      contacted: 'Contacted',
      site_visit_scheduled: 'Site Visit Scheduled',
      site_visit_done: 'Site Visit Done',
      negotiation: 'Negotiation',
      token_paid: 'Token Paid',
      closed_won: 'Closed (Won)',
      closed_lost: 'Closed (Lost)',
    };
    return map[s] || s;
  };

  const steps = useMemo(() => ([
    { key: 'new', label: 'Enquiry' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'site_visit_scheduled', label: 'Visit Scheduled' },
    { key: 'site_visit_done', label: 'Visit Done' },
    { key: 'token_paid', label: 'Token/Booking' },
  ]), []);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <h2>User Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px', marginTop: '20px' }}>
        <aside style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Menu</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', fontWeight: '600', color: '#475569' }}>
            <li style={{ color: activeTab === 'overview' ? '#0054a6' : undefined, cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>Overview</li>
            <li style={{ color: activeTab === 'enquiries' ? '#0054a6' : undefined, cursor: 'pointer' }} onClick={() => setActiveTab('enquiries')}>Enquiries / Tracking</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('shortlisted')}>Shortlisted</li>
            <li style={{ cursor: 'pointer' }} onClick={() => setActiveTab('settings')}>Profile Settings</li>
          </ul>
        </aside>
        <main style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {activeTab === 'overview' && (
            <>
              <h3>Welcome, {user?.name || 'Demo User'}!</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Track enquiries, schedule site visits, and manage your shortlist from here.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '18px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Enquiries</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px' }}>{leads.length}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Shortlisted</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px' }}>—</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Tracking</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px' }}>Live</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'enquiries' && (
            <>
              <h3 style={{ marginTop: 0 }}>Enquiries / Order Tracking</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
                This is the “ordering/tracking” module: Enquiry → Visit → Token/Booking → Close.
              </p>

              {loading && <div style={{ padding: '10px 0', fontWeight: 700, color: '#475569' }}>Loading…</div>}
              {error && <div style={{ padding: '10px 0', fontWeight: 700, color: '#b91c1c' }}>{error}</div>}

              {(!loading && !error && leads.length === 0) ? (
                <div style={{ marginTop: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                  <h4 style={{ margin: 0 }}>No enquiries yet</h4>
                  <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>
                    Open any property and submit “Request Call Back”. It will appear here with tracking.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
                  {leads.map((lead) => (
                    <div key={lead._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
                        <div>
                          <div style={{ fontWeight: 900 }}>{lead.property?.title || 'Property'}</div>
                          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>📍 {lead.property?.location || '-'}</div>
                        </div>
                        <div style={{ fontWeight: 900, color: '#0054a6' }}>{statusLabel(lead.status)}</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '8px', marginTop: '12px' }}>
                        {steps.map((s) => {
                          const isDone = (lead.timeline || []).some((t) => t.status === s.key);
                          const isNow = lead.status === s.key;
                          const bg = isNow ? '#0054a6' : isDone ? '#16a34a' : '#e2e8f0';
                          const color = isNow || isDone ? '#fff' : '#334155';
                          return (
                            <div key={s.key} style={{ background: bg, color, padding: '8px', borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '12px' }}>
                              {s.label}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
                        Lead: <strong>{lead.name}</strong> · {lead.phone}
                        {lead.preferredVisitAt ? <> · Visit: <strong>{new Date(lead.preferredVisitAt).toLocaleString()}</strong></> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
