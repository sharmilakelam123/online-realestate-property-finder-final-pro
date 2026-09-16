import React, { useEffect, useMemo, useState } from "react";
import "./Reports.css";

export default function Reports() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let page = 1;
        let allProperties = [];

        while (true) {
          const response = await fetch(
            `http://localhost:5000/api/properties?limit=60&page=${page}`
          );

          if (!response.ok) {
            throw new Error("Unable to load reports");
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

    fetchProperties();
  }, []);

  const reportData = useMemo(() => {
    const total = properties.length;

    const sale = properties.filter(
      (property) => property.listingType === "sale"
    ).length;

    const rent = properties.filter(
      (property) => property.listingType === "rent"
    ).length;

    const verified = properties.filter(
      (property) => property.verified
    ).length;

    const pending = total - verified;

    const categoryCounts = {};

    properties.forEach((property) => {
      const category =
        property.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    return {
      total,
      sale,
      rent,
      verified,
      pending,
      categoryCounts,
    };
  }, [properties]);

  if (loading) {
    return (
      <div className="reports-card">
        <div className="reports-loading">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="reports-card">
      <div className="reports-header">
        <div>
          <h2>Property Reports</h2>
          <p>
            Overview of property listings and verification
            status
          </p>
        </div>
      </div>

      <div className="reports-stats">
        <div className="report-stat">
          <span className="report-stat-icon">🏠</span>
          <div>
            <strong>{reportData.total}</strong>
            <span>Total Properties</span>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">✓</span>
          <div>
            <strong>{reportData.verified}</strong>
            <span>Verified</span>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">⏳</span>
          <div>
            <strong>{reportData.pending}</strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">₹</span>
          <div>
            <strong>{reportData.sale}</strong>
            <span>For Sale</span>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">🔑</span>
          <div>
            <strong>{reportData.rent}</strong>
            <span>For Rent</span>
          </div>
        </div>
      </div>

      <div className="reports-section">
        <h3>Property Categories</h3>

        <div className="category-list">
          {Object.entries(
            reportData.categoryCounts
          ).map(([category, count]) => (
            <div
              className="category-row"
              key={category}
            >
              <span>
                {category.replace(
                  /-/g,
                  " "
                )}
              </span>

              <div className="category-progress">
                <div
                  className="category-progress-fill"
                  style={{
                    width: `${
                      reportData.total
                        ? (count /
                            reportData.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}