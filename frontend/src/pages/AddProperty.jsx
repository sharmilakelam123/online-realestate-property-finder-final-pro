import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("Owner");
  const [purpose, setPurpose] = useState("Sell");
  const [whatsapp, setWhatsapp] = useState("");

  const handleStart = (e) => {
    e.preventDefault();

    if (!whatsapp || whatsapp.length < 10) {
      alert("Please enter a valid WhatsApp number.");
      return;
    }

    navigate("/property-details", {
      state: {
        postedBy: userType,
        purpose: purpose,
        whatsapp: whatsapp,
      },
    });
  };

  return (
    <div className="add-property-page">
      <div className="add-property-container">

        <div className="add-property-card">

          <div className="post-property-top">
            <div className="post-property-icon">🏠</div>

            <h1>Post your property</h1>

            <p className="post-property-subtitle">
              Post your property Ad to sell or rent online for Free!
            </p>
          </div>

          <form onSubmit={handleStart} className="property-form">

            <div className="post-section">
              <h2>Let's get you started</h2>
            </div>

            {/* YOU ARE */}
            <div className="form-group">
              <label>You are:</label>

              <div className="option-row">

                <button
                  type="button"
                  className={`select-option ${
                    userType === "Owner" ? "selected" : ""
                  }`}
                  onClick={() => setUserType("Owner")}
                >
                  <span>👤</span>
                  Owner
                </button>

                <button
                  type="button"
                  className={`select-option ${
                    userType === "Agent" ? "selected" : ""
                  }`}
                  onClick={() => setUserType("Agent")}
                >
                  <span>💼</span>
                  Agent
                </button>

                <button
                  type="button"
                  className={`select-option ${
                    userType === "Builder" ? "selected" : ""
                  }`}
                  onClick={() => setUserType("Builder")}
                >
                  <span>🏗️</span>
                  Builder
                </button>

              </div>
            </div>

            {/* PURPOSE */}
            <div className="form-group">
              <label>You are here to:</label>

              <div className="option-row">

                <button
                  type="button"
                  className={`select-option ${
                    purpose === "Sell" ? "selected" : ""
                  }`}
                  onClick={() => setPurpose("Sell")}
                >
                  <span>🏠</span>
                  Sell
                </button>

                <button
                  type="button"
                  className={`select-option ${
                    purpose === "Rent/Lease" ? "selected" : ""
                  }`}
                  onClick={() => setPurpose("Rent/Lease")}
                >
                  <span>🔑</span>
                  Rent / Lease
                </button>

                <button
                  type="button"
                  className={`select-option ${
                    purpose === "PG" ? "selected" : ""
                  }`}
                  onClick={() => setPurpose("PG")}
                >
                  <span>🛏️</span>
                  List as PG
                </button>

              </div>
            </div>

            {/* WHATSAPP */}
            <div className="form-group">

              <label>Your WhatsApp number</label>

              <div className="whatsapp-input">

                <div className="country-code">
                  🇮🇳 +91
                </div>

                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="WhatsApp Number"
                  maxLength="10"
                  required
                />

              </div>

              <p className="input-help">
                Enter your WhatsApp No. to get enquiries from Buyer/Tenant
              </p>

            </div>

            {/* START */}
            <button
              type="submit"
              className="start-property-btn"
            >
              Start Now
              <span>→</span>
            </button>

            <p className="free-text">
              ✓ Free property listing &nbsp; • &nbsp;
              ✓ Get buyer/tenant enquiries
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}