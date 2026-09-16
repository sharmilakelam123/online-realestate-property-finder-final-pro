import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyPreview.css";

export default function PropertyPreview() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state || {};

  const handlePostProperty = () => {
    const existingProperties =
      JSON.parse(localStorage.getItem("properties")) || [];

    const newProperty = {
      id: Date.now(),
      ...data,
      status: "Active",
    };

    localStorage.setItem(
      "properties",
      JSON.stringify([...existingProperties, newProperty])
    );

    alert("Property posted successfully!");

    navigate("/");
  };

  return (
    <div className="property-preview-page">

      <div className="preview-header">
        <div>
          <h1>Preview Your Property</h1>
          <p>Review all details before posting your property</p>
        </div>

        <button
          className="preview-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="preview-progress">
        <div className="preview-step completed">
          <span>✓</span>
          <p>Basic Details</p>
        </div>

        <div className="preview-line completed"></div>

        <div className="preview-step completed">
          <span>✓</span>
          <p>Property Details</p>
        </div>

        <div className="preview-line completed"></div>

        <div className="preview-step completed">
          <span>✓</span>
          <p>Photos & Features</p>
        </div>

        <div className="preview-line completed"></div>

        <div className="preview-step active">
          <span>✓</span>
          <p>Preview</p>
        </div>
      </div>

      <div className="preview-card">

        <div className="preview-title">
          <h2>
            {data.propertyType || "Property"}
          </h2>

          <span className="preview-status">
            Ready to Post
          </span>
        </div>

        <p className="preview-location">
          📍 {data.locality || ""}, {data.city || ""}
        </p>

        {data.photos && data.photos.length > 0 && (
          <div className="preview-photos">

            <img
              src={data.photos[0].url}
              alt="Property"
              className="main-preview-image"
            />

            <div className="small-preview-images">

              {data.photos.slice(1, 5).map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`Property ${index + 2}`}
                />
              ))}

            </div>

          </div>
        )}

        <div className="preview-price">

          <div>
            <span>
              {data.purpose === "Rent"
                ? "Monthly Rent"
                : "Expected Price"}
            </span>

            <strong>
              ₹{data.price || "0"}
            </strong>
          </div>

          <div>
            <span>Purpose</span>
            <strong>{data.purpose || "Sale"}</strong>
          </div>

        </div>

        <div className="preview-section">

          <h3>Property Details</h3>

          <div className="preview-details-grid">

            <div>
              <span>Property Type</span>
              <strong>{data.propertyType || "-"}</strong>
            </div>

            <div>
              <span>BHK</span>
              <strong>{data.bhk || "-"}</strong>
            </div>

            <div>
              <span>Bathrooms</span>
              <strong>{data.bathrooms || "-"}</strong>
            </div>

            <div>
              <span>Built-up Area</span>
              <strong>
                {data.area ? `${data.area} sq.ft` : "-"}
              </strong>
            </div>

            <div>
              <span>Floor</span>
              <strong>{data.floor || "-"}</strong>
            </div>

            <div>
              <span>Parking</span>
              <strong>{data.parking || "-"}</strong>
            </div>

            <div>
              <span>Furnishing</span>
              <strong>{data.furnishing || "-"}</strong>
            </div>

            <div>
              <span>Ownership</span>
              <strong>{data.ownership || "-"}</strong>
            </div>

          </div>

        </div>

        <div className="preview-section">

          <h3>Address</h3>

          <p>
            {data.address || "Address not provided"}
          </p>

        </div>

        {data.description && (
          <div className="preview-section">

            <h3>Description</h3>

            <p>{data.description}</p>

          </div>
        )}

        {data.amenities && data.amenities.length > 0 && (
          <div className="preview-section">

            <h3>Amenities & Features</h3>

            <div className="preview-amenities">

              {data.amenities.map((amenity) => (
                <span key={amenity}>
                  ✓ {amenity}
                </span>
              ))}

            </div>

          </div>
        )}

        <div className="owner-preview">

          <h3>Contact Details</h3>

          <p>
            <strong>Name:</strong>{" "}
            {data.ownerName || "-"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {data.phone || "-"}
          </p>

          {data.email && (
            <p>
              <strong>Email:</strong>{" "}
              {data.email}
            </p>
          )}

        </div>

        <div className="post-property-area">

          <p>
            Your property is ready to be published.
          </p>

          <button
            className="post-property-btn"
            onClick={handlePostProperty}
          >
            🚀 Post Property
          </button>

        </div>

      </div>

    </div>
  );
}