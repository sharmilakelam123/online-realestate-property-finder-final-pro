import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../redux/store";
import { motion } from "framer-motion";

export default function PropertyCard({ property }) {
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state) => state.properties?.favorites || []
  );

  // IMPORTANT:
  // Real database properties use MongoDB _id.
  // Never use a fake id such as p1, p2, p3 for the property details URL.
  const propertyId = property?._id
    ? String(property._id)
    : property?.id && !/^p\d+$/i.test(String(property.id))
      ? String(property.id)
      : "";

  const isShortlisted = propertyId
    ? favorites.includes(propertyId)
    : false;

  const formatCurrency = (num) => {
    const value = Number(num || 0);

    if (value >= 10000000) {
      return "₹" + (value / 10000000).toFixed(2) + " Cr";
    }

    if (value >= 100000) {
      return "₹" + (value / 100000).toFixed(2) + " L";
    }

    return "₹" + value.toLocaleString("en-IN");
  };

  const categoryLabel = (() => {
    const cat = property?.category;

    if (!cat) {
      return property?.type || "";
    }

    if (cat === "apartment") return "Apartment";
    if (cat === "villa") return "Villa";
    if (cat === "independent-house") return "Independent House";
    if (cat === "plot") return "Plot";
    if (cat === "office") return "Office";
    if (cat === "shop") return "Shop";

    return String(cat);
  })();

  const bhk = property?.bedrooms ?? property?.bhk;

  const areaText =
    property?.areaSqft ??
    property?.area ??
    "";

  const advertiser = property?.advertiserType
    ? String(property.advertiserType).charAt(0).toUpperCase() +
      String(property.advertiserType).slice(1)
    : "";

  const handleFavorite = () => {
    if (!propertyId) {
      return;
    }

    dispatch(toggleFavorite(propertyId));
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
      }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          position: "relative",
          height: "180px",
        }}
      >
        <img
          src={
            property?.image ||
            property?.images?.[0] ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
          }
          alt={property?.title || "Property"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {property?.verified && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              padding: "3px 8px",
              borderRadius: "4px",
            }}
          >
            ✓ Verified
          </span>
        )}

        {/* Shortlist */}
        <button
          type="button"
          onClick={handleFavorite}
          disabled={!propertyId}
          aria-label="Shortlist property"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: propertyId ? "pointer" : "default",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{
              color: isShortlisted ? "#f43f5e" : "#cbd5e1",
              fontSize: "18px",
            }}
          >
            {isShortlisted ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* Property Details */}
      <div
        style={{
          padding: "16px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#0054a6",
            margin: "0 0 4px 0",
          }}
        >
          {formatCurrency(property?.price)}
        </h3>

        <h4
          style={{
            fontSize: "14px",
            fontWeight: "600",
            margin: "0 0 8px 0",
            lineHeight: "1.4",
            height: "40px",
            overflow: "hidden",
          }}
        >
          {property?.title || "Property"}
        </h4>

        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "0 0 14px 0",
          }}
        >
          📍{" "}
          {property?.location ||
            property?.locality ||
            property?.city ||
            "Location unavailable"}
        </p>

        {advertiser && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                color: "#0f172a",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                padding: "3px 8px",
                borderRadius: "999px",
              }}
            >
              Posted by {advertiser}
            </span>

            {property?.featured && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#fff",
                  background: "#0f172a",
                  padding: "3px 8px",
                  borderRadius: "999px",
                }}
              >
                Featured
              </span>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #f1f5f9",
            paddingTop: "10px",
            marginTop: "auto",
            fontSize: "12px",
            color: "#475569",
          }}
        >
          <span>
            <strong>BHK:</strong> {bhk || "-"}
          </span>

          <span>
            <strong>Area:</strong>{" "}
            {areaText ? `${areaText} sq.ft` : "-"}
          </span>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          {propertyId ? (
            <Link
              to={`/property/${propertyId}`}
              style={{
                textDecoration: "none",
                textAlign: "center",
                backgroundColor: "#f1f5f9",
                color: "#1e293b",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Details
            </Link>
          ) : (
            <button
              type="button"
              disabled
              style={{
                backgroundColor: "#f1f5f9",
                color: "#94a3b8",
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "not-allowed",
              }}
            >
              Details
            </button>
          )}

          <button
            type="button"
            style={{
              backgroundColor: "#0054a6",
              color: "#ffffff",
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Contact
          </button>
        </div>

        {categoryLabel && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <strong>Type:</strong> {categoryLabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}