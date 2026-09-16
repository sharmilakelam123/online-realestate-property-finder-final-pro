import React, { useEffect, useState } from "react";
import "./Approvals.css";

export default function Approvals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      let page = 1;
      let allProperties = [];

      while (true) {
        const response = await fetch(
          `http://localhost:5000/api/properties?limit=60&page=${page}`
        );

        if (!response.ok) {
          throw new Error("Unable to load properties");
        }

        const data = await response.json();

        const items = Array.isArray(data)
          ? data
          : data.items || [];

        allProperties = [...allProperties, ...items];

        if (!data.pages || page >= data.pages) {
          break;
        }

        page++;
      }

      const uniqueProperties = Array.from(
        new Map(
          allProperties.map((property) => [
            property._id,
            property,
          ])
        ).values()
      );

      setProperties(uniqueProperties);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const pendingProperties = properties.filter(
    (property) => !property.verified
  );

  const handleApprove = (id) => {
    setProperties((current) =>
      current.map((property) =>
        property._id === id
          ? { ...property, verified: true }
          : property
      )
    );
  };

  if (loading) {
    return (
      <div className="approvals-card">
        <div className="approvals-loading">
          Loading approvals...
        </div>
      </div>
    );
  }

  return (
    <div className="approvals-card">
      <div className="approvals-header">
        <div>
          <h2>Property Approvals</h2>
          <p>Review properties waiting for admin approval</p>
        </div>

        <div className="approvals-count">
          {pendingProperties.length} Pending
        </div>
      </div>

      {pendingProperties.length === 0 ? (
        <div className="approvals-empty">
          <div className="approvals-empty-icon">✓</div>
          <h3>All Properties Approved</h3>
          <p>
            There are no properties waiting for approval.
          </p>
        </div>
      ) : (
        <div className="approvals-list">
          {pendingProperties.map((property) => (
            <div
              className="approval-item"
              key={property._id}
            >
              <img
                src={
                  property.image ||
                  property.images?.[0] ||
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=200&q=80"
                }
                alt={property.title || "Property"}
              />

              <div className="approval-info">
                <h3>
                  {property.title || "Untitled Property"}
                </h3>

                <p>
                  {property.locality ||
                    property.city ||
                    property.location ||
                    "Location not available"}
                </p>

                <span>
                  {property.category || "Property"} •{" "}
                  {property.listingType === "rent"
                    ? "For Rent"
                    : "For Sale"}
                </span>
              </div>

              <div className="approval-price">
                ₹
                {Number(
                  property.price || 0
                ).toLocaleString("en-IN")}
              </div>

              <button
                className="approve-btn"
                onClick={() => handleApprove(property._id)}
              >
                ✓ Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}