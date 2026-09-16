import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/store';
import { motion, AnimatePresence } from 'framer-motion';
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  
  // Extract Redux States
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const favorites = useSelector(state => state.properties.favorites);
  const handleLogoutClick = () => {
    dispatch(logout());
    navigate('/');
  };

  const megaMenus = useMemo(() => ({
    buyers: {
      title: 'For Buyers',
      items: [
        { label: 'Property Rates', to: '/services?tab=buyers&tool=rates' },
        { label: 'Home Loan Tools & More', to: '/services?tab=buyers&tool=emi' },
        { label: 'Articles & News', to: '/services?tab=buyers&tool=rates' },
        { label: 'Policies (GST, RERA)', to: '/services?tab=buyers&tool=policy' },
      ],
    },
    tenants: {
      title: 'For Tenants',
      items: [
        { label: 'Renting Guide', to: '/services?tab=tenants&tool=guide' },
        { label: 'Rent Receipt', to: '/services?tab=tenants&tool=rent' },
        { label: 'Tenant Articles', to: '/services?tab=tenants&tool=guide' },
      ],
    },
    owners: {
      title: 'For Owners',
      items: [
        { label: 'Post Property (Free)', to: '/add-property' },
        { label: 'Owner Services', to: '/services?tab=owners&tool=valuation' },
        { label: 'Seller Guide', to: '/services?tab=owners&tool=guide' },
      ],
    },
    dealers: {
      title: 'For Dealers / Builders',
      items: [
        { label: 'Dealer Services', to: '/services?tab=dealers&tool=analytics' },
        { label: 'Builder Services', to: '/services?tab=dealers&tool=analytics' },
        { label: 'Post Inventory', to: '/add-property' },
      ],
    },
  }), []);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* 99acres-style top strip */}
      <div style={{ borderBottom: '1px solid #f1f5f9', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { key: 'buyers', label: 'For Buyers' },
              { key: 'tenants', label: 'For Tenants' },
              { key: 'owners', label: 'For Owners' },
              { key: 'dealers', label: 'For Dealers / Builders' },
            ].map((m) => (
              <div
                key={m.key}
                onMouseEnter={() => setOpenMenu(m.key)}
                onMouseLeave={() => setOpenMenu((v) => (v === m.key ? '' : v))}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 800,
                    color: '#334155',
                    fontSize: '13px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                  }}
                >
                  {m.label}
                </button>

                <AnimatePresence>
                  {openMenu === m.key ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute',
                        top: '36px',
                        left: 0,
                        width: '260px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                        padding: '12px',
                        zIndex: 200,
                      }}
                    >
                      <div style={{ fontWeight: 900, marginBottom: '10px' }}>{megaMenus[m.key].title}</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {megaMenus[m.key].items.map((it) => (
                          <Link
                            key={it.label}
                            to={it.to}
                            onClick={() => setOpenMenu('')}
                            style={{
                              textDecoration: 'none',
                              color: '#0f172a',
                              fontWeight: 700,
                              fontSize: '13px',
                              padding: '8px 10px',
                              borderRadius: '10px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 900, background: '#0f172a', color: '#fff', padding: '3px 8px', borderRadius: '999px' }}>
                          Insights NEW
                        </span>
                        <Link to="/add-property" style={{ fontSize: '12px', fontWeight: 900, color: '#0054a6', textDecoration: 'none' }}>
                          Post property (Free)
                        </Link>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <Link
            to="/add-property"
            style={{
              textDecoration: 'none',
              fontWeight: 900,
              fontSize: '13px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: '#16a34a',
              color: '#ffffff',
            }}
          >
            Post property · Free
          </Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '24px',
            fontWeight: '800',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0054a6'
          }}>
            Real<span>Finder</span>
          </span>
          <span style={{
            backgroundColor: '#f1f5f9',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '20px',
            color: '#64748b',
            border: '1px solid #e2e8f0'
          }}>Pro</span>
        </Link>
        {/* Navigation Middle Links */}
        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={{ fontWeight: '600', color: '#475569', textDecoration: 'none' }}>Home</Link>
          <Link to="/properties" style={{ fontWeight: '600', color: '#475569', textDecoration: 'none' }}>Browse Properties</Link>
          <Link to="/add-property" style={{ fontWeight: '600', color: '#475569', textDecoration: 'none' }}>Sell / Rent</Link>
        </nav>
        {/* Action Right Side Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/favorites" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1e293b',
            fontWeight: '600',
            backgroundColor: '#f8fafc',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1'
          }}>
            <span>♥ Shortlisted</span>
            <span style={{
              backgroundColor: '#f43f5e',
              color: '#ffffff',
              borderRadius: '50%',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '700'
            }}>{favorites.length}</span>
          </Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: '600', color: '#0054a6' }}>
                Hi, {user?.name || 'User'}
              </Link>

              <div
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
                style={{ position: 'relative' }}
              >
                <button
                  type="button"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    color: '#0f172a',
                  }}
                >
                  My Activity
                </button>

                <AnimatePresence>
                  {accountOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute',
                        top: '40px',
                        right: 0,
                        width: '260px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                        padding: '12px',
                        zIndex: 300,
                      }}
                    >
                      <div style={{ fontWeight: 900, marginBottom: '10px' }}>My Activity</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <Link to="/recently-searched" onClick={() => setAccountOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, color: '#0f172a' }}>
                          Recently Searched
                        </Link>
                        <Link to="/recently-viewed" onClick={() => setAccountOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, color: '#0f172a' }}>
                          Recently Viewed
                        </Link>
                        <Link to="/favorites" onClick={() => setAccountOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, color: '#0f172a' }}>
                          Shortlisted
                        </Link>
                        <Link to="/contacted" onClick={() => setAccountOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, color: '#0f172a' }}>
                          Contacted
                        </Link>
                        <Link to="/add-property" onClick={() => setAccountOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, color: '#0054a6' }}>
                          Post Property (Free)
                        </Link>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            handleLogoutClick();
                          }}
                          style={{
                            width: '100%',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            color: '#0f172a',
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                backgroundColor: '#0054a6',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '6px',
                fontWeight: '800',
              }}
            >
              LOGIN / REGISTER
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
