import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyPhotos.css";

export default function PropertyPhotos() {
  const navigate = useNavigate();
  const location = useLocation();

  const previousData = location.state || {};

  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);

  const availableAmenities = [
    "Lift",
    "Power Backup",
    "Security",
    "Swimming Pool",
    "Gym",
    "Garden",
    "Club House",
    "CCTV",
    "Water Supply",
    "Parking",
    "Children's Play Area",
    "Visitor Parking",
  ];

  const handlePhotos = (event) => {
    const files = Array.from(event.target.files);

    const imageFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPhotos((previous) => [...previous, ...imageFiles]);
  };

  const removePhoto = (index) => {
    setPhotos((previous) =>
      previous.filter((_, photoIndex) => photoIndex !== index)
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      alert("Please upload at least one property photo");
      return;
    }

    navigate("/add-property/owner", {
      state: {
        ...previousData,
        photos,
        description,
        amenities,
      },
    });
  };

  return (
    <div className="property-photos-page">

      <div className="photos-header">
        <div>
          <h1>Photos & Features</h1>
          <p>Make your property attractive to genuine buyers and tenants</p>
        </div>

        <button
          className="photos-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="photos-progress">

        <div className="photo-progress-step completed">
          <span>✓</span>
          <p>Basic Details</p>
        </div>

        <div className="photo-progress-line completed"></div>

        <div className="photo-progress-step completed">
          <span>✓</span>
          <p>Property Details</p>
        </div>

        <div className="photo-progress-line active"></div>

        <div className="photo-progress-step active">
          <span>3</span>
          <p>Photos & Features</p>
        </div>

        <div className="photo-progress-line"></div>

        <div className="photo-progress-step">
          <span>4</span>
          <p>Owner Details</p>
        </div>

      </div>

      <div className="photos-card">

        <div className="upload-section">

          <h2>Property Photos</h2>

          <p className="photos-subtitle">
            Upload clear photos of your property. Good photos help your
            property get more attention.
          </p>

          <label className="upload-box">

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotos}
            />

            <div className="upload-icon">📷</div>

            <h3>Upload Property Photos</h3>

            <p>
              Click here to select photos from your device
            </p>

            <span>
              You can upload multiple images
            </span>

          </label>

          {photos.length > 0 && (
            <div className="photo-preview-grid">

              {photos.map((photo, index) => (
                <div className="photo-preview" key={index}>

                  <img
                    src={photo.url}
                    alt={`Property ${index + 1}`}
                  />

                  <button
                    onClick={() => removePhoto(index)}
                  >
                    ×
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        <div className="description-section">

          <h2>Property Description</h2>

          <p className="photos-subtitle">
            Tell buyers or tenants what makes this property special.
          </p>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Example: Spacious 3 BHK apartment with excellent ventilation, modern kitchen, parking facility and good connectivity..."
            rows="6"
          />

        </div>

        <div className="amenities-section">

          <h2>Property Features & Amenities</h2>

          <p className="photos-subtitle">
            Select all amenities available in your property.
          </p>

          <div className="amenities-grid">

            {availableAmenities.map((amenity) => (
              <button
                key={amenity}
                className={
                  amenities.includes(amenity)
                    ? "amenity selected"
                    : "amenity"
                }
                onClick={() => toggleAmenity(amenity)}
              >
                <span>
                  {amenities.includes(amenity) ? "✓" : "+"}
                </span>

                {amenity}
              </button>
            ))}

          </div>

        </div>

        <div className="photos-bottom">

          <span>Step 3 of 4</span>

          <button
            className="photos-continue-btn"
            onClick={handleContinue}
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}