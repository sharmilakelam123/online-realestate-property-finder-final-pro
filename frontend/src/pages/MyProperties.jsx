import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/properties";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

const getImage = (property) => {
  if (property?.image) return property.image;

  if (
    Array.isArray(property?.images) &&
    property.images.length > 0
  ) {
    return property.images[0];
  }

  return "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80";
};

const formatPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value)) return "Price on request";

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
};

const formatCategory = (category) => {
  if (!category) return "Property";

  return String(category)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function MyProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("Please login to view your properties.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API}/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to load your properties."
          );
        }

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];

        setProperties(items);
      } catch (err) {
        console.error("MY PROPERTIES ERROR:", err);
        setError(
          err?.message ||
            "Unable to load your properties."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete property."
        );
      }

      setProperties((current) =>
        current.filter(
          (property) => property._id !== id
        )
      );
    } catch (err) {
      alert(
        err?.message || "Unable to delete property."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#111827",
              }}
            >
              My Properties
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#6b7280",
              }}
            >
              Manage properties you have posted on Nestora.
            </p>
          </div>

          <Link
            to="/add-property"
            style={{
              textDecoration: "none",
              background: "#2563eb",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            + Post Your Property
          </Link>
        </div>

        {loading && (
          <div
            style={{
              background: "#fff",
              padding: "50px 20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px" }}>🏠</div>
            <h2>Loading your properties...</h2>
            <p style={{ color: "#6b7280" }}>
              Please wait.
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              background: "#fff",
              padding: "40px 20px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px" }}>⚠️</div>

            <h2
              style={{
                color: "#111827",
                marginBottom: "10px",
              }}
            >
              Unable to load properties
            </h2>

            <p
              style={{
                color: "#dc2626",
                marginBottom: "20px",
              }}
            >
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                border: "none",
                background: "#2563eb",
                color: "#fff",
                padding: "11px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          properties.length === 0 && (
            <div
              style={{
                background: "#fff",
                padding: "60px 20px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "10px",
                }}
              >
                🏠
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  color: "#111827",
                }}
              >
                No properties found
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "25px",
                }}
              >
                You have not posted any properties yet.
              </p>

              <Link
                to="/add-property"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  background: "#2563eb",
                  color: "#fff",
                  padding: "12px 22px",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                Post Your Property
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          properties.length > 0 && (
            <>
              <div
                style={{
                  marginBottom: "18px",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {properties.length}{" "}
                {properties.length === 1
                  ? "Property"
                  : "Properties"}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                {properties.map((property) => (
                  <div
                    key={property._id}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={getImage(property)}
                      alt={property.title || "Property"}
                      style={{
                        width: "100%",
                        height: "210px",
                        objectFit: "cover",
                      }}
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80";
                      }}
                    />

                    <div style={{ padding: "18px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#2563eb",
                            fontWeight: "700",
                            textTransform:
                              "uppercase",
                          }}
                        >
                          {property.listingType ||
                            "Property"}
                        </span>

                        {property.verified && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#059669",
                              fontWeight: "700",
                            }}
                          >
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h2
                        style={{
                          margin: "0 0 8px",
                          fontSize: "20px",
                          color: "#111827",
                        }}
                      >
                        {property.title ||
                          "Untitled Property"}
                      </h2>

                      <p
                        style={{
                          margin: "0 0 8px",
                          color: "#6b7280",
                        }}
                      >
                        📍{" "}
                        {property.location ||
                          property.locality ||
                          property.city ||
                          "Location not available"}
                      </p>

                      <p
                        style={{
                          margin: "0 0 10px",
                          color: "#374151",
                        }}
                      >
                        {property.bedrooms
                          ? `${property.bedrooms} BHK • `
                          : ""}
                        {property.bathrooms
                          ? `${property.bathrooms} Bath • `
                          : ""}
                        {property.areaSqft
                          ? `${property.areaSqft} sqft`
                          : ""}
                      </p>

                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "21px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {formatPrice(
                          property.price
                        )}
                      </p>

                      <p
                        style={{
                          margin: "0 0 18px",
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {formatCategory(
                          property.category
                        )}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            navigate(
                              `/property/${property._id}`
                            )
                          }
                          style={{
                            flex: 1,
                            minWidth: "120px",
                            border: "none",
                            background: "#2563eb",
                            color: "#fff",
                            padding: "11px 12px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          View Property
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/add-property/details?id=${property._id}`
                            )
                          }
                          style={{
                            flex: 1,
                            minWidth: "80px",
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            color: "#374151",
                            padding: "11px 12px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              property._id
                            )
                          }
                          style={{
                            flex: 1,
                            minWidth: "80px",
                            border: "1px solid #fecaca",
                            background: "#fff",
                            color: "#dc2626",
                            padding: "11px 12px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}