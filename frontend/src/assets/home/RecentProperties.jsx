import React from "react";
import "./RecentProperties.css";

const formatPrice = (price) => {
  if (!price) return "Price on request";

  const num = Number(price);

  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }

  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }

  return `₹${num.toLocaleString("en-IN")}`;
};

const getImage = (property) => {
  return (
    property?.image ||
    property?.images?.[0] ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
  );
};

export default function RecentProperties({
  properties = [],
  onOpen,
}) {
  const recentProperties = [...properties]
    .filter((property) => property?._id)
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    })
    .slice(0, 6);

  if (recentProperties.length === 0) {
    return null;
  }

  return (
    <section className="recent-properties-section">
      <div className="recent-properties-container">

        <div className="recent-properties-header">
          <div>
            <span className="recent-properties-label">
              JUST ADDED
            </span>

            <h2>Recently Added Properties</h2>

            <p>
              Explore the latest properties added to RealFinder.
            </p>
          </div>

          <button
            className="recent-view-all"
            onClick={() => {
              window.location.href = "/search-results";
            }}
          >
            View All Properties →
          </button>
        </div>

        <div className="recent-properties-grid">
          {recentProperties.map((property) => (
            <article
              className="recent-property-card"
              key={property._id}
            >
              <div className="recent-property-image-wrapper">

                <img
                  src={getImage(property)}
                  alt={property.title || "Property"}
                  className="recent-property-image"
                />

                <span className="recent-property-badge">
                  {property.listingType === "rent"
                    ? "FOR RENT"
                    : "FOR SALE"}
                </span>

                {property.verified && (
                  <span className="recent-verified">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="recent-property-content">

                <div className="recent-property-price">
                  {formatPrice(property.price)}
                </div>

                <h3>
                  {property.title || "Beautiful Property"}
                </h3>

                <p className="recent-property-location">
                  📍{" "}
                  {property.locality ||
                    property.location ||
                    property.city ||
                    "Location available"}
                </p>

                <div className="recent-property-details">
                  {property.bedrooms !== undefined &&
                    property.bedrooms !== null && (
                      <span>
                        🛏 {property.bedrooms} BHK
                      </span>
                    )}

                  {property.areaSqft && (
                    <span>
                      📐{" "}
                      {Number(property.areaSqft).toLocaleString(
                        "en-IN"
                      )}{" "}
                      sq.ft
                    </span>
                  )}

                  {property.bathrooms !== undefined &&
                    property.bathrooms !== null && (
                      <span>
                        🛁 {property.bathrooms} Bath
                      </span>
                    )}
                </div>

                <button
                  className="recent-property-button"
                  onClick={() => onOpen?.(property)}
                >
                  View Property
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}