import React, { useState } from "react";
import "./Booking.css";

export default function BookingForm({ propertyId, propertyTitle }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property: propertyId,
          propertyTitle,
          name: formData.name,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setSubmitted(true);

      setFormData({
        name: "",
        phone: "",
        date: "",
        time: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h2>Book a Property Visit</h2>
        <p>
          Schedule a visit and explore the property in person.
        </p>
      </div>

      {propertyTitle && (
        <div className="booking-property-name">
          <strong>Property:</strong> {propertyTitle}
        </div>
      )}

      {submitted ? (
        <div className="booking-success">
          <div className="booking-success-icon">✓</div>

          <h3>Visit Request Submitted!</h3>

          <p>
            Your property visit request has been submitted successfully.
          </p>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
          >
            Book Another Visit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="booking-field">
            <label>Your Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="booking-field">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="booking-row">
            <div className="booking-field">
              <label>Visit Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="booking-field">
              <label>Preferred Time</label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="booking-field">
            <label>Message</label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any special request?"
              rows="4"
            />
          </div>

          {error && (
            <div
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="booking-submit-btn"
            disabled={loading}
          >
            {loading ? "Booking..." : "📅 Book Visit"}
          </button>
        </form>
      )}
    </div>
  );
}