import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const basicData = location.state || {};

  const [bhk, setBhk] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [parking, setParking] = useState("");

  const handleContinue = () => {
    if (!bhk || !bathrooms || !area) {
      alert("Please fill all required details");
      return;
    }

    navigate("/add-property/photos", {
      state: {
        ...basicData,
        bhk,
        bathrooms,
        area,
        furnishing,
        floor,
        totalFloors,
        parking,
      },
    });
  };

  return (
    <div className="property-details-page">

      <div className="property-details-header">
        <div>
          <h1>Property Details</h1>
          <p>Tell buyers and tenants more about your property</p>
        </div>

        <button
          className="details-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="details-progress">

        <div className="progress-step completed">
          <span>✓</span>
          <p>Basic Details</p>
        </div>

        <div className="progress-line active"></div>

        <div className="progress-step active">
          <span>2</span>
          <p>Property Details</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>3</span>
          <p>Photos & Features</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>4</span>
          <p>Owner Details</p>
        </div>

      </div>

      <div className="details-card">

        <div className="selected-property">
          <span>Property Type</span>
          <strong>{basicData.propertyType || "Property"}</strong>

          <span>Location</span>
          <strong>
            {basicData.locality || ""}, {basicData.city || ""}
          </strong>
        </div>

        <h2>Property Information</h2>

        <p className="details-subtitle">
          Add the basic specifications of your property
        </p>

        <div className="details-section">

          <label>Bedrooms / BHK *</label>

          <div className="choice-row">

            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map(
              (item) => (
                <button
                  key={item}
                  className={bhk === item ? "choice selected" : "choice"}
                  onClick={() => setBhk(item)}
                >
                  {item}
                </button>
              )
            )}

          </div>

        </div>

        <div className="details-section">

          <label>Bathrooms *</label>

          <div className="choice-row">

            {["1", "2", "3", "4+"].map((item) => (
              <button
                key={item}
                className={
                  bathrooms === item
                    ? "choice selected"
                    : "choice"
                }
                onClick={() => setBathrooms(item)}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        <div className="details-grid">

          <div className="details-input">

            <label>Built-up Area *</label>

            <div className="area-input">
              <input
                type="number"
                placeholder="Enter area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              <span>sq.ft</span>
            </div>

          </div>

          <div className="details-input">

            <label>Floor</label>

            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">Select Floor</option>
              <option>Ground Floor</option>
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
              <option>4th Floor</option>
              <option>5th Floor</option>
              <option>6th Floor</option>
              <option>7th Floor</option>
              <option>8th Floor</option>
              <option>9th Floor</option>
              <option>10th+ Floor</option>
            </select>

          </div>

        </div>

        <div className="details-grid">

          <div className="details-input">

            <label>Total Floors</label>

            <select
              value={totalFloors}
              onChange={(e) => setTotalFloors(e.target.value)}
            >
              <option value="">Select Total Floors</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6+</option>
            </select>

          </div>

          <div className="details-input">

            <label>Parking</label>

            <select
              value={parking}
              onChange={(e) => setParking(e.target.value)}
            >
              <option value="">Select Parking</option>
              <option>Bike Parking</option>
              <option>Car Parking</option>
              <option>Both Bike & Car</option>
              <option>No Parking</option>
            </select>

          </div>

        </div>

        <div className="details-section">

          <label>Furnishing</label>

          <div className="choice-row">

            {["Fully Furnished", "Semi Furnished", "Unfurnished"].map(
              (item) => (
                <button
                  key={item}
                  className={
                    furnishing === item
                      ? "choice selected"
                      : "choice"
                  }
                  onClick={() => setFurnishing(item)}
                >
                  {item}
                </button>
              )
            )}

          </div>

        </div>

        <div className="details-bottom">

          <span>Step 2 of 4</span>

          <button
            className="details-continue-btn"
            onClick={handleContinue}
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}