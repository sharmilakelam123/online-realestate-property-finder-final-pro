import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={e => { e.preventDefault(); alert("Registration successful! Please login."); navigate('/login'); }}>
        <input type="text" placeholder="Full Name" required style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="email" placeholder="Email" required style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <input type="password" placeholder="Password" required style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <button type="submit" style={{ width: '100%', backgroundColor: '#0054a6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>Already have an account? <Link to="/login" style={{ color: '#0054a6' }}>Sign In</Link></p>
    </div>
  );
}
