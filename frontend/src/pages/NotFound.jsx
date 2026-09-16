import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1>404 - Page Not Found</h1>
      <p style={{ margin: '14px 0 24px 0', color: '#64748b' }}>We can't find the page you are looking for.</p>
      <Link to="/" style={{ backgroundColor: '#0054a6', color: '#ffffff', textDecoration: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: '600' }}>Return Home</Link>
    </div>
  );
}
