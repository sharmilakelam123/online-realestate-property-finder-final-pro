import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0b1523',
        color: '#94a3b8',
        padding: '50px 25px 20px',
        borderTop: '5px solid #0054a6',
        marginTop: '60px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
          gap: '35px',
          marginBottom: '40px',
        }}
      >

        {/* Brand */}
        <div>
          <h2
            style={{
              color: '#ffffff',
              margin: '0 0 12px',
              fontSize: '25px',
            }}
          >
            RealFinder
          </h2>

          <p
            style={{
              fontSize: '14px',
              maxWidth: '280px',
              lineHeight: '1.7',
              margin: 0,
            }}
          >
            India's professional property finder. Discover verified
            flats, villas, houses and plots across India.
          </p>

          <p
            style={{
              fontSize: '13px',
              marginTop: '18px',
              color: '#60a5fa',
            }}
          >
            Find. Compare. Connect.
          </p>
        </div>

        {/* For Buyers */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
            For Buyers
          </h4>

          <p>Browse Properties</p>
          <p>Buy Property</p>
          <p>Saved Properties</p>
          <p>Property Search</p>
        </div>

        {/* For Tenants */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
            For Tenants
          </h4>

          <p>Rent Properties</p>
          <p>Rental Homes</p>
          <p>Find Apartments</p>
          <p>Saved Rentals</p>
        </div>

        {/* For Owners */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
            For Owners
          </h4>

          <p>Post Property</p>
          <p>Sell Property</p>
          <p>Rent Property</p>
          <p>Manage Listings</p>
        </div>

        {/* For Dealers */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
            For Dealers
          </h4>

          <p>Dealer Registration</p>
          <p>Dealer Dashboard</p>
          <p>Manage Listings</p>
          <p>Find Customers</p>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '15px' }}>
            Company
          </h4>

          <p>Home</p>
          <p>About Us</p>
          <p>RERA Rules</p>
          <p>Contact Support</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          maxWidth: '1200px',
          margin: '0 auto',
          fontSize: '12px',
        }}
      >
        <span>
          © 2026 RealFinder. All rights reserved.
        </span>

        <span>
          Privacy Policy&nbsp;&nbsp; | &nbsp;&nbsp;Terms & Conditions
        </span>
      </div>
    </footer>
  );
}