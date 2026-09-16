import React from "react";

import PropertiesTable from "../components/admin/PropertiesTable";
import Approvals from "../components/admin/Approvals";
import UsersTable from "../components/admin/UsersTable";
import Reports from "../components/admin/Reports";
import VisitBookings from "../components/admin/VisitBookings";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard-page">

      {/* Header */}
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-eyebrow">
            REALFINDER ADMIN
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage properties, approvals, users, bookings and
            platform reports.
          </p>
        </div>

        <div className="admin-live-badge">
          <span></span>
          Live Data
        </div>
      </header>

      {/* Welcome */}
      <section className="admin-overview">
        <div className="admin-welcome-card">
          <div>
            <span>Administration</span>

            <h2>
              Property Management System
            </h2>

            <p>
              Monitor property listings, user activity,
              visit bookings and platform activity from one place.
            </p>
          </div>

          <div className="admin-welcome-icon">
            🏢
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="admin-dashboard-section">
        <Reports />
      </section>

      {/* Approvals */}
      <section className="admin-dashboard-section">
        <Approvals />
      </section>

      {/* Visit Bookings */}
      <section className="admin-dashboard-section">
        <VisitBookings />
      </section>

      {/* Properties */}
      <section className="admin-dashboard-section">
        <PropertiesTable />
      </section>

      {/* Users */}
      <section className="admin-dashboard-section">
        <UsersTable />
      </section>

    </div>
  );
}