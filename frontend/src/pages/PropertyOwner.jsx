import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyOwner.css";

export default function PropertyOwner() {
  const navigate = useNavigate();
  const location = useLocation();

  const previousData = location.state || {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [ownership, setOwnership] = useState("");

  const handleContinue = () => {
    if (!name || !phone || !price) {
      alert("Please fill all required details");
      return;
    }

    navigate("/add-property/preview", {
      state: {
        ...previousData,
        ownerName: name,
        phone,
        email,
        price,
        maintenance,
        ownership,
      },
    });
  };

  return (
    <div className="property-owner-page">

      <div className="owner-header">
        <div>
          <h1>Owner & Pricing Details</h1>
          <p>Almost done! Add your contact and property pricing details.</p>
        </div>

        <button
          className="owner-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="owner-progress">

        <div className="owner-step completed">
          <span>✓</span>
          <p>Basic Details</p>
        </div>

        <div className="owner-line completed"></div>

        <div className="owner-step completed">
          <span>✓</span>
          <p>Property Details</p>
        </div>

        <div className="owner-line completed"></div>

        <div className="owner-step completed">
          <span>✓</span>
          <p>Photos & Features</p>
        </div>

        <div className="owner-line active"></div>

        <div className="owner-step active">
          <span>4</span>
          <p>Owner Details</p>
        </div>

      </div>

      <div className="owner-card">

        <div className="owner-section">

          <h2>Property Pricing</h2>

          <p className="owner-subtitle">
            Set the price you expect for your property.
          </p>

          <div className="owner-grid">

            <div className="owner-input">

              <label>
                {previousData.purpose === "Rent"
                  ? "Monthly Rent *"
                  : "Expected Price *"}
              </label>

              <div className="price-input">
                <span>₹</span>

                <input
                  type="number"
                  placeholder={
                    previousData.purpose === "Rent"
                      ? "Enter monthly rent"
                      : "Enter expected price"
                  }
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

            </div>

            {previousData.purpose === "Rent" && (
              <div className="owner-input">

                <label>Monthly Maintenance</label>

                <div className="price-input">
                  <span>₹</span>

                  <input
                    type="number"
                    placeholder="Enter maintenance"
                    value={maintenance}
                    onChange={(e) =>
                      setMaintenance(e.target.value)
                    }
                  />
                </div>

              </div>
            )}

          </div>

        </div>

        <div className="owner-section">

          <h2>Owner Contact Details</h2>

          <p className="owner-subtitle">
            Buyers or tenants can contact you regarding this property.
          </p>

          <div className="owner-grid">

            <div className="owner-input">

              <label>Full Name *</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>

            <div className="owner-input">

              <label>Phone Number *</label>

              <input
                type="tel"
                maxLength="10"
                placeholder="Enter 10 digit mobile number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />

            </div>

          </div>

          <div className="owner-input full">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

        </div>

        <div className="owner-section">

          <h2>Ownership</h2>

          <p className="owner-subtitle">
            Select your relationship with this property.
          </p>

          <div className="ownership-options">

            {["Owner", "Agent", "Builder"].map((item) => (
              <button
                key={item}
                className={
                  ownership === item
                    ? "ownership selected"
                    : "ownership"
                }
                onClick={() => setOwnership(item)}
              >
                {ownership === item ? "✓ " : ""}
                {item}
              </button>
            ))}

          </div>

        </div>

        <div className="owner-note">
          🔒 Your contact information will be used only for property-related
          communication.
        </div>

        <div className="owner-bottom">

          <span>Step 4 of 4</span>

          <button
            className="owner-continue-btn"
            onClick={handleContinue}
          >
            Preview Property →
          </button>

        </div>

      </div>

    </div>
  );
}