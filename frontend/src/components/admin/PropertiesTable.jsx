import React, { useEffect, useMemo, useState } from "react";
import "./PropertiesTable.css";
export default function PropertiesTable() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

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
      } catch (err) {
        console.error(err);
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const text = [
        property.title,
        property.location,
        property.city,
        property.locality,
        property.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesType =
        listingType === "all" ||
        property.listingType === listingType;

      return matchesSearch && matchesType;
    });
  }, [properties, search, listingType]);

  if (loading) {
    return (
      <div className="admin-table-card">
        <div className="admin-loading">
          Loading properties...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-table-card">
        <div className="admin-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <div>
          <h2>All Properties</h2>
          <p>
            Manage properties listed on RealFinder
          </p>
        </div>

        <div className="admin-property-count">
          {filteredProperties.length} Properties
        </div>
      </div>

      <div className="admin-table-controls">
        <input
          type="text"
          placeholder="Search property, city or locality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        >
          <option value="all">All Listings</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-properties-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th>Bedrooms</th>
              <th>Area</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-empty">
                  No properties found.
                </td>
              </tr>
            ) : (
              filteredProperties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <div className="admin-property-info">
                      <img
                        src={
                          property.image ||
                          property.images?.[0] ||
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=120&q=80"
                        }
                        alt={property.title || "Property"}
                      />

                      <div>
                        <strong>
                          {property.title || "Untitled Property"}
                        </strong>

                        <span>
                          {property.category || "Property"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    {property.locality ||
                      property.city ||
                      property.location ||
                      "—"}
                  </td>

                  <td>
                    <span className="admin-type-badge">
                      {property.listingType === "rent"
                        ? "Rent"
                        : "Sale"}
                    </span>
                  </td>

                  <td>
                    ₹{Number(property.price || 0).toLocaleString("en-IN")}
                  </td>

                  <td>
                    {property.bedrooms ?? "—"}
                  </td>

                  <td>
                    {property.areaSqft || property.area
                      ? `${property.areaSqft || property.area} sqft`
                      : "—"}
                  </td>

                  <td>
                    <span
                      className={
                        property.verified
                          ? "admin-status verified"
                          : "admin-status pending"
                      }
                    >
                      {property.verified
                        ? "Verified"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}