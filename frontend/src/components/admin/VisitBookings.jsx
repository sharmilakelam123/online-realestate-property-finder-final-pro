import React, { useEffect, useState } from "react";
import "./VisitBookings.css";

const API_URL = "http://localhost:5000/api/bookings";

export default function VisitBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === id
            ? { ...booking, status: data.booking.status }
            : booking
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update booking");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "booking-status confirmed";
    if (status === "Cancelled") return "booking-status cancelled";
    return "booking-status pending";
  };

  if (loading) {
    return (
      <div className="visit-bookings-card">
        <div className="visit-bookings-header">
          <div>
            <span className="admin-section-label">VISITS</span>
            <h2>Property Visit Bookings</h2>
          </div>
        </div>

        <div className="booking-loading">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="visit-bookings-card">
      <div className="visit-bookings-header">
        <div>
          <span className="admin-section-label">VISITS</span>
          <h2>Property Visit Bookings</h2>
          <p>
            Manage property visit requests from users.
          </p>
        </div>

        <button
          className="booking-refresh-btn"
          onClick={fetchBookings}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="booking-error">
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="booking-empty">
          <div className="booking-empty-icon">📅</div>
          <h3>No visit bookings yet</h3>
          <p>
            Property visit bookings will appear here.
          </p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="booking-table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Visitor</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="booking-property">
                      <strong>
                        {booking.propertyTitle || "Property"}
                      </strong>

                      {booking.property?.location && (
                        <span>
                          {booking.property.location}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <strong>{booking.name}</strong>
                  </td>

                  <td>{booking.phone}</td>

                  <td>{booking.date}</td>

                  <td>{booking.time}</td>

                  <td>
                    <span className={getStatusClass(booking.status)}>
                      {booking.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <select
                      className="booking-status-select"
                      value={booking.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(
                          booking._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}