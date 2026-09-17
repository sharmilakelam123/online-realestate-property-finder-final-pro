import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropertyCard from "../components/property/PropertyCard";

const API = "https://online-realestate-property-finder-final-rdfh.onrender.com/api/properties";

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .trim();

const getPropertyType = (property) =>
  property.type ||
  property.propertyType ||
  property.category ||
  property.property_type ||
  "";

const getBedrooms = (property) =>
  Number(
    property.bedrooms ??
      property.bedroom ??
      property.bhk ??
      property.BHK ??
      0
  );

const getPrice = (property) =>
  Number(
    property.price ??
      property.amount ??
      property.expectedPrice ??
      property.expected_price ??
      0
  );

const getArea = (property) =>
  Number(
    property.areaSqft ??
      property.area ??
      property.builtUpArea ??
      property.builtupArea ??
      property.superBuiltUpArea ??
      0
  );

/* ----------------------------------
   ALL SEARCHABLE PROPERTY TEXT
----------------------------------- */
const getSearchText = (property) =>
  [
    property.title,
    property.location,
    property.address,
    property.city,
    property.locality,
    property.areaName,
    property.category,
    property.type,
    property.propertyType,
    property.projectName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/* ----------------------------------
   LOCATION ALIASES
----------------------------------- */
const locationAliases = {
  hyd: [
    "hyderabad",
    "secunderabad",
    "gachibowli",
    "kondapur",
    "madhapur",
    "hitech city",
    "hi-tech city",
    "banjara hills",
    "jubilee hills",
    "kukatpally",
  ],

  hyderabad: [
    "hyderabad",
    "secunderabad",
    "gachibowli",
    "kondapur",
    "madhapur",
    "hitech city",
    "hi-tech city",
    "banjara hills",
    "jubilee hills",
    "kukatpally",
  ],

  vizag: [
    "vizag",
    "visakhapatnam",
    "madhurawada",
    "gajuwaka",
    "rushikonda",
    "bhogapuram",
    "anandapuram",
  ],

  visakhapatnam: [
    "vizag",
    "visakhapatnam",
    "madhurawada",
    "gajuwaka",
    "rushikonda",
    "bhogapuram",
    "anandapuram",
  ],

  bangalore: [
    "bangalore",
    "bengaluru",
    "whitefield",
    "electronic city",
    "koramangala",
    "marathahalli",
    "hebbal",
    "sarjapur",
  ],

  bengaluru: [
    "bangalore",
    "bengaluru",
    "whitefield",
    "electronic city",
    "koramangala",
    "marathahalli",
    "hebbal",
    "sarjapur",
  ],

  kondapur: [
    "kondapur",
    "hafeezpet",
    "gachibowli",
    "miyapur",
    "madhapur",
    "hitech city",
    "hi-tech city",
  ],

  gachibowli: [
    "gachibowli",
    "kondapur",
    "madhapur",
    "hitech city",
    "financial district",
    "nanakramguda",
  ],

  madhapur: [
    "madhapur",
    "kondapur",
    "gachibowli",
    "hitech city",
    "jubilee hills",
  ],
};

/* ----------------------------------
   PRICE FORMAT
----------------------------------- */
const formatPrice = (price) => {
  if (!price) return "Price on Request";

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }

  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  }

  return `₹${price.toLocaleString("en-IN")}`;
};

function SearchResults() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const searchParam = params.get("search") || "";
  const purposeParam = params.get("purpose") || "Buy";
  const typeParam = params.get("type") || "All";
  const budgetParam = params.get("budget") || "Any Budget";
  const bhkParam = params.get("bhk") || "Any BHK";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParam);
  const [purpose, setPurpose] = useState(purposeParam);
  const [propertyType, setPropertyType] =
    useState(typeParam);
  const [budget, setBudget] = useState(budgetParam);
  const [bhk, setBhk] = useState(bhkParam);

  const [sortBy, setSortBy] = useState("relevance");

  /* ----------------------------------
     FETCH REAL DATABASE PROPERTIES
  ----------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      try {
        setLoading(true);

        const response = await fetch(`${API}?limit=60`);

        if (!response.ok) {
          throw new Error(
            `API failed with status ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "SEARCH RESULTS API DATA:",
          data
        );

        /*
          IMPORTANT:
          Backend response is:

          {
            items: [...],
            total: 30,
            page: 1,
            pages: 2,
            limit: 24
          }

          So we MUST read data.items.
        */

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.items)) {
          list = data.items;
        } else if (Array.isArray(data.properties)) {
          list = data.properties;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.results)) {
          list = data.results;
        }

        console.log(
          "TOTAL DATABASE PROPERTIES:",
          list.length
        );

        if (!cancelled) {
          setProperties(list);
        }
      } catch (error) {
        console.error(
          "Failed to load properties:",
          error
        );

        if (!cancelled) {
          setProperties([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ----------------------------------
     FILTER PROPERTIES
  ----------------------------------- */
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    /* ================================
       1. LOCATION SEARCH
    ================================= */

    const searchValue = normalize(search);

    if (searchValue) {
      const aliases =
        locationAliases[searchValue] || [searchValue];

      result = result.filter((property) => {
        const text = getSearchText(property);

        return aliases.some((alias) =>
          text.includes(normalize(alias))
        );
      });
    }

    /* ================================
       2. PURPOSE
    ================================= */

    const normalizedPurpose =
      normalize(purpose);

    result = result.filter((property) => {
      const listingType = normalize(
        property.listingType ??
          property.listing_type ??
          property.purpose ??
          property.listingPurpose ??
          property.transactionType ??
          property.transaction_type ??
          ""
      );

      /*
        If backend doesn't have purpose information,
        DON'T remove the property.
      */
      if (!listingType) {
        return true;
      }

      /* BUY */
      if (normalizedPurpose === "buy") {
        return (
          listingType.includes("sale") ||
          listingType.includes("sell") ||
          listingType.includes("buy")
        );
      }

      /* RENT */
      if (normalizedPurpose === "rent") {
        return (
          listingType.includes("rent") ||
          listingType.includes("lease")
        );
      }

      /* NEW PROJECTS */
      if (
        normalizedPurpose === "new projects"
      ) {
        const text = getSearchText(property);

        return (
          text.includes("new") ||
          text.includes("project") ||
          text.includes("launch")
        );
      }

      /* COMMERCIAL */
      if (
        normalizedPurpose === "commercial"
      ) {
        const text = getSearchText(property);

        return (
          text.includes("commercial") ||
          text.includes("office") ||
          text.includes("shop") ||
          text.includes("warehouse")
        );
      }

      return true;
    });

    /* ================================
       3. PROPERTY TYPE
    ================================= */

    if (
      propertyType &&
      normalize(propertyType) !== "all"
    ) {
      const wanted =
        normalize(propertyType);

      result = result.filter((property) => {
        const actual =
          normalize(getPropertyType(property));

        /*
          If property type is missing,
          don't unnecessarily remove it.
        */
        if (!actual) {
          return true;
        }

        if (wanted === "apartment") {
          return (
            actual.includes("apartment") ||
            actual.includes("flat")
          );
        }

        if (wanted === "villa") {
          return actual.includes("villa");
        }

        if (wanted === "house") {
          return (
            actual.includes("house") ||
            actual.includes("independent")
          );
        }

        if (
          wanted === "independent house"
        ) {
          return (
            actual.includes("independent") ||
            actual.includes("house")
          );
        }

        if (wanted === "office") {
          return (
            actual.includes("office") ||
            actual.includes("commercial")
          );
        }

        if (wanted === "shop") {
          return (
            actual.includes("shop") ||
            actual.includes("retail")
          );
        }

        if (wanted === "plot") {
          return (
            actual.includes("plot") ||
            actual.includes("land")
          );
        }

        return (
          actual.includes(wanted) ||
          wanted.includes(actual)
        );
      });
    }

    /* ================================
       4. BHK
    ================================= */

    if (
      bhk &&
      normalize(bhk) !== "any bhk"
    ) {
      const requestedBhk = parseInt(
        bhk,
        10
      );

      if (!Number.isNaN(requestedBhk)) {
        result = result.filter((property) => {
          const bedrooms =
            getBedrooms(property);

          /*
            Missing bedroom data should not
            unnecessarily remove property.
          */
          if (!bedrooms) {
            return true;
          }

          return bedrooms === requestedBhk;
        });
      }
    }

    /* ================================
       5. BUDGET
    ================================= */

    if (
      budget &&
      normalize(budget) !== "any budget"
    ) {
      result = result.filter((property) => {
        const price = getPrice(property);

        /*
          Price missing = don't hide property
        */
        if (!price) {
          return true;
        }

        if (
          budget === "Under ₹50 Lac"
        ) {
          return price < 5000000;
        }

        if (
          budget === "₹50 Lac - ₹1 Cr"
        ) {
          return (
            price >= 5000000 &&
            price <= 10000000
          );
        }

        if (
          budget === "₹1 Cr - ₹2 Cr"
        ) {
          return (
            price >= 10000000 &&
            price <= 20000000
          );
        }

        if (
          budget === "₹2 Cr - ₹5 Cr"
        ) {
          return (
            price >= 20000000 &&
            price <= 50000000
          );
        }

        if (
          budget === "Above ₹5 Cr"
        ) {
          return price > 50000000;
        }

        return true;
      });
    }

    /* ================================
       6. SORT
    ================================= */

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          getPrice(a) - getPrice(b)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          getPrice(b) - getPrice(a)
      );
    }

    if (sortBy === "area-high") {
      result.sort(
        (a, b) =>
          getArea(b) - getArea(a)
      );
    }

    return result;
  }, [
    properties,
    search,
    purpose,
    propertyType,
    budget,
    bhk,
    sortBy,
  ]);

  /* ----------------------------------
     CLEAR FILTERS
  ----------------------------------- */
  const clearFilters = () => {
    setSearch("");
    setPurpose("Buy");
    setPropertyType("All");
    setBudget("Any Budget");
    setBhk("Any BHK");
  };

  /* ----------------------------------
     SELECTED LOCATION
  ----------------------------------- */
  const selectedLocation =
    search || "All Properties";

  /* ----------------------------------
     LOCALITIES
  ----------------------------------- */
  const localities = useMemo(() => {
    const values = [];

    properties.forEach((property) => {
      const locality =
        property.locality ||
        property.areaName ||
        property.city;

      if (
        locality &&
        !values.includes(locality)
      ) {
        values.push(locality);
      }
    });

    return values.slice(0, 10);
  }, [properties]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        color: "#222",
      }}
    >
      {/* ============================
          NAVBAR
      ============================= */}

      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ddd",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: 24,
              fontWeight: 800,
              color: "#e63946",
            }}
          >
            RealEstate
          </Link>

          <div
            style={{
              flex: 1,
              display: "flex",
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              style={{
                border: "none",
                padding: "12px",
                outline: "none",
                fontWeight: 600,
              }}
            >
              <option>Buy</option>
              <option>Rent</option>
              <option>
                New Projects
              </option>
              <option>Commercial</option>
            </select>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search city, locality or project"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "12px 15px",
                fontSize: 15,
              }}
            />

            <button
              onClick={() =>
                setSearch(
                  search.trim()
                )
              }
              style={{
                border: "none",
                background: "#e63946",
                color: "#fff",
                padding: "0 25px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          <Link
            to="/add-property"
            style={{
              textDecoration: "none",
              color: "#222",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Post Property{" "}
            <span
              style={{
                color: "#e63946",
              }}
            >
              FREE
            </span>
          </Link>
        </div>
      </div>

      {/* ============================
          BREADCRUMB
      ============================= */}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "15px 20px 5px",
          fontSize: 13,
          color: "#777",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#555",
            textDecoration: "none",
          }}
        >
          Home
        </Link>

        {" › "} Property in{" "}
        {selectedLocation}
      </div>

      {/* ============================
          CONTENT
      ============================= */}

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "10px 20px 50px",
        }}
      >
        {/* TITLE */}

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            marginBottom: 15,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            Property for{" "}
            {purpose.toLowerCase()} in{" "}
            {selectedLocation}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#666",
            }}
          >
            {loading
              ? "Loading real properties..."
              : `${filteredProperties.length} properties found`}
          </p>
        </div>

        {/* LOCALITIES */}

        {localities.length > 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 15,
              marginBottom: 15,
            }}
          >
            <strong>
              Popular localities
            </strong>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {localities.map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setSearch(item)
                    }
                    style={{
                      border:
                        "1px solid #ddd",
                      background: "#fff",
                      borderRadius: 20,
                      padding:
                        "7px 14px",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* ============================
            MAIN GRID
        ============================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "270px 1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* FILTERS */}

          <aside
            style={{
              background: "#fff",
              border:
                "1px solid #ddd",
              borderRadius: 8,
              position: "sticky",
              top: 80,
            }}
          >
            {/* FILTER HEADER */}

            <div
              style={{
                padding: 17,
                borderBottom:
                  "1px solid #eee",
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <strong>
                Filters
              </strong>

              <button
                onClick={
                  clearFilters
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color:
                    "#e63946",
                  cursor:
                    "pointer",
                }}
              >
                Clear all
              </button>
            </div>

            {/* PURPOSE */}

            <div
              style={{
                padding: 17,
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <strong>
                Purpose
              </strong>

              {[
                "Buy",
                "Rent",
                "New Projects",
                "Commercial",
              ].map((item) => (
                <label
                  key={item}
                  style={{
                    display:
                      "block",
                    marginTop: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="purpose"
                    checked={
                      purpose ===
                      item
                    }
                    onChange={() =>
                      setPurpose(
                        item
                      )
                    }
                  />{" "}
                  {item}
                </label>
              ))}
            </div>

            {/* PROPERTY TYPE */}

            <div
              style={{
                padding: 17,
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <strong>
                Property Type
              </strong>

              <select
                value={
                  propertyType
                }
                onChange={(e) =>
                  setPropertyType(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 10,
                }}
              >
                <option>
                  All
                </option>
                <option>
                  Apartment
                </option>
                <option>
                  Villa
                </option>
                <option>
                  House
                </option>
                <option>
                  Independent House
                </option>
                <option>
                  Office
                </option>
                <option>
                  Shop
                </option>
                <option>
                  Plot
                </option>
              </select>
            </div>

            {/* BHK */}

            <div
              style={{
                padding: 17,
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <strong>
                Bedrooms
              </strong>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {[
                  "Any BHK",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setBhk(item)
                    }
                    style={{
                      padding: 9,
                      border:
                        bhk ===
                        item
                          ? "1px solid #e63946"
                          : "1px solid #ddd",
                      background:
                        bhk ===
                        item
                          ? "#fff1f2"
                          : "#fff",
                      borderRadius: 5,
                      cursor:
                        "pointer",
                    }}
                  >
                    {item ===
                    "Any BHK"
                      ? item
                      : `${item} BHK`}
                  </button>
                ))}
              </div>
            </div>

            {/* BUDGET */}

            <div
              style={{
                padding: 17,
              }}
            >
              <strong>
                Budget
              </strong>

              <select
                value={budget}
                onChange={(e) =>
                  setBudget(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 10,
                }}
              >
                <option>
                  Any Budget
                </option>
                <option>
                  Under ₹50 Lac
                </option>
                <option>
                  ₹50 Lac - ₹1 Cr
                </option>
                <option>
                  ₹1 Cr - ₹2 Cr
                </option>
                <option>
                  ₹2 Cr - ₹5 Cr
                </option>
                <option>
                  Above ₹5 Cr
                </option>
              </select>
            </div>
          </aside>

          {/* ============================
              RESULTS
          ============================= */}

          <main>
            <div
              style={{
                background: "#fff",
                border:
                  "1px solid #ddd",
                borderRadius: 8,
                padding: 14,
                marginBottom: 15,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <strong>
                {loading
                  ? "Loading..."
                  : `${filteredProperties.length} Properties`}
              </strong>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                style={{
                  padding: 8,
                }}
              >
                <option value="relevance">
                  Sort: Relevance
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="area-high">
                  Area: High to Low
                </option>
              </select>
            </div>

            {/* LOADING */}

            {loading && (
              <div
                style={{
                  background:
                    "#fff",
                  padding: 60,
                  textAlign:
                    "center",
                  borderRadius: 8,
                }}
              >
                <h2>
                  Finding properties...
                </h2>

                <p>
                  Loading real
                  properties from
                  database
                </p>
              </div>
            )}

            {/* PROPERTY CARDS */}

            {!loading &&
              filteredProperties.length >
                0 && (
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 16,
                  }}
                >
                  {filteredProperties.map(
                    (
                      property,
                      index
                    ) => (
                      <div
                        key={
                          property._id ||
                          property.id ||
                          index
                        }
                      >
                        <PropertyCard
                          property={
                            property
                          }
                        />
                      </div>
                    )
                  )}
                </div>
              )}

            {/* NO RESULTS */}

            {!loading &&
              filteredProperties.length ===
                0 && (
                <div
                  style={{
                    background:
                      "#fff",
                    border:
                      "1px solid #ddd",
                    borderRadius: 8,
                    padding: 70,
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 50,
                    }}
                  >
                    🏠
                  </div>

                  <h2>
                    No matching
                    properties
                  </h2>

                  <p
                    style={{
                      color:
                        "#777",
                    }}
                  >
                    We couldn't
                    find
                    properties
                    matching
                    these
                    filters.
                  </p>

                  <button
                    onClick={
                      clearFilters
                    }
                    style={{
                      background:
                        "#e63946",
                      color:
                        "#fff",
                      border:
                        "none",
                      padding:
                        "11px 22px",
                      borderRadius: 5,
                      cursor:
                        "pointer",
                      fontWeight:
                        700,
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;