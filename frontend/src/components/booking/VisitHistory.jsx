import React, { useEffect, useState } from "react";
import "./Booking.css";

export default function VisitHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setBookings(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel visit");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
    } catch (err) {
      alert(err.message || "Unable to cancel visit");
    }
  };

  if (loading) {
    return (
      <div className="visit-history-container">
        <div className="no-visits">
          <div className="no-visits-icon">📅</div>
          <h3>Loading Visits...</h3>
          <p>Please wait while we load your visit history.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visit-history-container">
        <div className="no-visits">
          <div className="no-visits-icon">⚠️</div>
          <h3>Unable to Load Visits</h3>
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visit-history-container">
      <div className="visit-history-header">
        <span>MY BOOKINGS</span>
        <h2>Visit History</h2>
        <p>
          View and manage your scheduled property visits.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="no-visits">
          <div className="no-visits-icon">📅</div>

          <h3>No Visits Booked Yet</h3>

          <p>
            Your property visit bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="visit-history-list">
          {bookings.map((booking) => (
            <div
              className="visit-card"
              key={booking._id}
            >
              <div className="visit-card-top">
                <div>
                  <span className="visit-label">
                    PROPERTY
                  </span>

                  <h3>
                    {booking.propertyTitle ||
                      booking.property?.title ||
                      "Property Visit"}
                  </h3>
                </div>

                <span
                  className={`visit-status ${booking.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="visit-details">
                <div>
                  <span>👤 Name</span>
                  <strong>{booking.name}</strong>
                </div>

                <div>
                  <span>📞 Phone</span>
                  <strong>{booking.phone}</strong>
                </div>

                <div>
                  <span>📅 Visit Date</span>
                  <strong>{booking.date}</strong>
                </div>

                <div>
                  <span>🕐 Time</span>
                  <strong>{booking.time}</strong>
                </div>
              </div>

              {booking.message && (
                <div className="visit-message">
                  <span>Message</span>
                  <p>{booking.message}</p>
                </div>
              )}

              {booking.status !== "Cancelled" && (
                <button
                  className="cancel-visit-btn"
                  onClick={() =>
                    cancelBooking(booking._id)
                  }
                >
                  Cancel Visit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}