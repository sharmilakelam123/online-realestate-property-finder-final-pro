import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import Reviews from "../components/home/Reviews";

const API = "http://localhost:5000/api/properties";

const fallbackProperties = [];
function formatPrice(price, listingType) {
  if (String(listingType).toLowerCase() === "rent") {
    return `₹ ${Number(price).toLocaleString("en-IN")}/month`;
  }

  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }

  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(2)} L`;
  }

  return `₹ ${Number(price).toLocaleString("en-IN")}`;
}

function PropertyCard({ property, onOpen }) {
  const [liked, setLiked] = useState(false);

  const propertyImage =
    property.image ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

  const propertyType =
    property.type ||
    property.propertyType ||
    property.category ||
    "Property";

  const propertyArea =
    property.area ||
    property.areaSqft ||
    property.builtUpArea ||
    0;

  const propertyBedrooms =
    property.bedrooms ??
    property.bhk ??
    0;

  const propertyBathrooms =
    property.bathrooms ??
    property.bath ??
    0;

  const propertyOwner =
    property.owner ||
    property.ownerName ||
    "Owner";

  const propertyImages =
    property.images?.length || 1;

  const listingType =
    String(property.listingType || "Sale").toLowerCase();

  return (
    <article className="property-card">
      <div className="property-image-wrap">
        <img
          src={propertyImage}
          alt={property.title}
          className="property-image"
        />

        <span className="listing-badge">
          {listingType.includes("rent")
            ? "FOR RENT"
            : "FOR SALE"}
        </span>

        {property.verified && (
          <span className="verified-badge">
            ✓ Verified
          </span>
        )}

        <button
          className={`heart-button ${
            liked ? "liked" : ""
          }`}
          onClick={() => setLiked(!liked)}
        >
          {liked ? "♥" : "♡"}
        </button>

        <span className="image-count">
          ▧ {propertyImages}
        </span>
      </div>

      <div className="property-card-body">
        <div className="price-line">
          <h3>
            {formatPrice(
              Number(property.price || 0),
              property.listingType
            )}
          </h3>

          <span>{propertyType}</span>
        </div>

        <h2>{property.title}</h2>

        <p className="location-text">
          📍 {property.location || property.city}
        </p>

        <div className="property-stats">
          <span>
            🛏 {propertyBedrooms} BHK
          </span>

          <span>
            ▣ {propertyArea} sq.ft
          </span>

          <span>
            🚿 {propertyBathrooms} Bath
          </span>
        </div>

        <div className="card-bottom">
          <div>
            <small>TRUST SCORE</small>

            <strong>
              {property.trustScore || 80}/100
            </strong>
          </div>

          <span>
            Owner: {propertyOwner}
          </span>
        </div>

        <button
          className="details-button"
          onClick={() => onOpen(property)}
        >
          View Property →
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [properties, setProperties] =
    useState([]);

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Buy");
  const [type, setType] = useState("All");
  const [budget, setBudget] =
    useState("Any Budget");
  const [bhk, setBhk] =
    useState("Any BHK");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllProperties = async () => {
      try {
        const firstRes = await fetch(
          `${API}?limit=60&page=1`
        );

        if (!firstRes.ok) {
          throw new Error("API Error");
        }

        const firstData = await firstRes.json();

        const firstItems = Array.isArray(firstData)
          ? firstData
          : firstData?.items ||
            firstData?.properties ||
            [];

        const totalPages = Math.max(
          1,
          Number(firstData?.pages || 1)
        );

        let allItems = [...firstItems];

        for (
          let page = 2;
          page <= totalPages;
          page += 1
        ) {
          const pageRes = await fetch(
            `${API}?limit=60&page=${page}`
          );

          if (!pageRes.ok) {
            continue;
          }

          const pageData = await pageRes.json();

          const pageItems = Array.isArray(pageData)
            ? pageData
            : pageData?.items ||
              pageData?.properties ||
              [];

          allItems = [
            ...allItems,
            ...pageItems,
          ];
        }

        const realItems = allItems.filter(
          (property) =>
            property?._id &&
            !/^p\d+$/i.test(
              String(property._id)
            )
        );

        const uniqueItems = Array.from(
          new Map(
            realItems.map((property) => [
              String(property._id),
              property,
            ])
          ).values()
        );

        console.log(
          "TOTAL DATABASE PROPERTIES LOADED:",
          uniqueItems.length
        );

        setProperties(uniqueItems);
      } catch (error) {
        console.error(
          "HOME PROPERTY API ERROR:",
          error
        );
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllProperties();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const text = search
        .trim()
        .toLowerCase();

      const combined =
        `${p.title || ""} ${
          p.location || ""
        } ${
          p.city || ""
        } ${
          p.locality || ""
        } ${
          p.address || ""
        }`.toLowerCase();

      const locationMatch =
        !text || combined.includes(text);

      const actualType =
        String(
          p.type ||
            p.propertyType ||
            p.category ||
            ""
        ).toLowerCase();

      const typeMatch =
        type === "All" ||
        actualType.includes(
          type.toLowerCase()
        );

      let modeMatch = true;

      const listing =
        String(
          p.listingType || "Sale"
        ).toLowerCase();

      if (mode === "Buy") {
        modeMatch =
          listing.includes("sale") ||
          listing.includes("buy");
      }

      if (mode === "Rent") {
        modeMatch =
          listing.includes("rent") ||
          listing.includes("lease");
      }

      if (mode === "New Projects") {
        modeMatch =
          listing.includes("project") ||
          String(p.title || "")
            .toLowerCase()
            .includes("project") ||
          String(p.title || "")
            .toLowerCase()
            .includes("launch");
      }

      if (mode === "Commercial") {
        modeMatch =
          actualType.includes("commercial") ||
          actualType.includes("office") ||
          actualType.includes("shop") ||
          actualType.includes("warehouse");
      }

      let budgetMatch = true;

      if (budget === "Under ₹50 L") {
        budgetMatch =
          Number(p.price) < 5000000;
      }

      if (budget === "₹50 L - ₹1 Cr") {
        budgetMatch =
          Number(p.price) >= 5000000 &&
          Number(p.price) <= 10000000;
      }

      if (budget === "Above ₹1 Cr") {
        budgetMatch =
          Number(p.price) > 10000000;
      }

      let bhkMatch = true;

      const bedrooms = Number(
        p.bedrooms ?? p.bhk ?? 0
      );

      if (bhk === "1 BHK") {
        bhkMatch = bedrooms === 1;
      }

      if (bhk === "2 BHK") {
        bhkMatch = bedrooms === 2;
      }

      if (bhk === "3 BHK") {
        bhkMatch = bedrooms === 3;
      }

      if (bhk === "4 BHK") {
        bhkMatch = bedrooms === 4;
      }

      if (bhk === "5+ BHK") {
        bhkMatch = bedrooms >= 5;
      }

      return (
        locationMatch &&
        typeMatch &&
        modeMatch &&
        budgetMatch &&
        bhkMatch
      );
    });
  }, [
    properties,
    search,
    mode,
    type,
    budget,
    bhk,
  ]);

  const openProperty = (property) => {
    localStorage.setItem(
      "selectedProperty",
      JSON.stringify(property)
    );

    window.location.href =
      `/property/${property._id}`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (mode) {
      params.set("purpose", mode);
    }

    if (type !== "All") {
      params.set("type", type);
    }

    if (budget !== "Any Budget") {
      params.set("budget", budget);
    }

    if (bhk !== "Any BHK") {
      params.set("bhk", bhk);
    }

    window.location.href =
      `/search-results?${params.toString()}`;
  };

  const clearFilters = () => {
    setSearch("");
    setMode("Buy");
    setType("All");
    setBudget("Any Budget");
    setBhk("Any BHK");
  };

  const chooseCity = (city) => {
    setSearch(city);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="real-finder">

      {/* NAVBAR */}
      <header className="rf-navbar">

        <a
          href="/"
          className="rf-logo"
        >
          <span className="logo-mark">
            R
          </span>

          <div>
            <strong>
              RealFinder
            </strong>

            <small>
              Property Intelligence
            </small>
          </div>
        </a>

        <nav className="main-nav">

          <a
            className="active"
            href="/"
          >
            Home
          </a>

          <a href="/buy">
            Buy
          </a>

          <a href="/rent">
            Rent
          </a>

          <a href="/sell">
            Sell
          </a>

          <a href="/new-projects">
            New Projects
          </a>

          <a href="/visit-history">
            My Visits
          </a>
          {/* PLOTS & LAND REMOVED */}

        </nav>

        <div className="nav-actions">

          <a
            href="/add-property"
            className="post-btn"
          >
            + Post Property Free
          </a>

          {/* ADMIN ADDED NEXT TO POST PROPERTY */}

          <a
            href="/admin"
            className="admin-nav-link"
          >
            Admin
          </a>

          <a
            href="/login"
            className="login-btn"
          >
            Login
          </a>

        </div>

      </header>

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-topline">
            INDIA'S SMARTER PROPERTY DISCOVERY PLATFORM
          </div>

          <h1>
            Find your place.
            <br />
            <span>
              Find your future.
            </span>
          </h1>

          <p>
            Discover verified homes, plots, rentals
            and new projects with transparent
            property information.
          </p>

          <div className="search-panel">

            <div className="search-tabs">

              {[
                "Buy",
                "Rent",
                "New Projects",
                "Commercial",
              ].map((item) => (
                <button
                  key={item}
                  className={
                    mode === item
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setMode(item)
                  }
                >
                  {item}
                </button>
              ))}

            </div>

            <div className="search-fields">

              <div className="search-field location-field">

                <span className="field-icon">
                  📍
                </span>

                <div>

                  <small>
                    LOCATION
                  </small>

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="City, locality or landmark"
                  />

                </div>

              </div>

              <div className="search-field">

                <div>

                  <small>
                    PROPERTY TYPE
                  </small>

                  <select
                    value={type}
                    onChange={(e) =>
                      setType(
                        e.target.value
                      )
                    }
                  >
                    <option>All</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>
                      Independent House
                    </option>
                    <option>Plot</option>
                    <option>Commercial</option>
                  </select>

                </div>

              </div>

              <div className="search-field">

                <div>

                  <small>
                    BUDGET
                  </small>

                  <select
                    value={budget}
                    onChange={(e) =>
                      setBudget(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Any Budget
                    </option>

                    <option>
                      Under ₹50 L
                    </option>

                    <option>
                      ₹50 L - ₹1 Cr
                    </option>

                    <option>
                      Above ₹1 Cr
                    </option>
                  </select>

                </div>

              </div>

              <div className="search-field">

                <div>

                  <small>
                    BHK
                  </small>

                  <select
                    value={bhk}
                    onChange={(e) =>
                      setBhk(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Any BHK
                    </option>

                    <option>
                      1 BHK
                    </option>

                    <option>
                      2 BHK
                    </option>

                    <option>
                      3 BHK
                    </option>

                    <option>
                      4 BHK
                    </option>

                    <option>
                      5+ BHK
                    </option>
                  </select>

                </div>

              </div>

              <button
                className="search-button"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

          </div>

          <div className="hero-trust">

            <span>
              ✓ Verified listings
            </span>

            <span>
              ✓ Transparent information
            </span>

            <span>
              ✓ Property Trust Score
            </span>

          </div>

        </div>

      </section>

      {/* QUICK NAV */}
      <div className="quick-nav">

        <button
          onClick={() => {
            setMode("Buy");
            setType("Apartment");
          }}
        >
          🏢 Apartments
        </button>

        <button
          onClick={() => {
            setMode("Buy");
            setType("Villa");
          }}
        >
          🏡 Villas
        </button>

        <button
          onClick={() => {
            setMode("Rent");
            setType("All");
          }}
        >
          🔑 Rental Homes
        </button>

        <button
          onClick={() => {
            setMode("Buy");
            setType("Plot");
          }}
        >
          📐 Plots & Land
        </button>

        <button
          onClick={() =>
            setMode("New Projects")
          }
        >
          🏗 New Projects
        </button>

        <button
          onClick={() =>
            setMode("Commercial")
          }
        >
          🏢 Commercial
        </button>

      </div>

      <main className="home-main">

        {/* RECOMMENDED PROPERTIES */}
        <section
          className="section-block"
          id="properties"
        >

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                EXPLORE REAL ESTATE
              </span>

              <h2>
                Recommended Properties
              </h2>

              <p>
                {filtered.length} properties
                matching your search preferences
              </p>

            </div>

            <button
              className="clear-btn"
              onClick={clearFilters}
            >
              Clear filters ↗
            </button>

          </div>

          {loading && (
            <div className="loading-text">
              Finding the best properties...
            </div>
          )}

          <div className="property-grid">

            {filtered
              .slice(0, 6)
              .map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onOpen={openProperty}
                />
              ))}

          </div>

          {!loading &&
            filtered.length === 0 && (
              <div className="empty-state">

                <div>⌕</div>

                <h3>
                  No matching properties
                </h3>

                <p>
                  Try another city, budget,
                  BHK or property type.
                </p>

                <button
                  onClick={clearFilters}
                >
                  Reset Search
                </button>

              </div>
            )}

        </section>

        {/* POST PROPERTY BANNER */}
        <section className="post-property-banner">

          <div className="post-property-content">

            <h2>
              Sell or rent faster at the right price!
            </h2>

            <p>
              Your perfect buyer is waiting, list your property now
            </p>

            <a
              href="/add-property"
              className="post-property-button"
            >
              Post Property, It's FREE
            </a>

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              <span>🟢</span>
              Post via Whatsapp →
            </a>

          </div>

          <div className="post-property-person">

            <img
              src="/realFinder-owner.png"
              alt="Property owner"
            />

          </div>

        </section>

        {/* POPULAR CITIES */}
        <section className="section-block">

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                POPULAR MARKETS
              </span>

              <h2>
                Explore Properties by City
              </h2>

              <p>
                Search homes, rentals and land
                across India's major cities.
              </p>

            </div>

          </div>

          <div className="city-grid">

            {[
              [
                "Hyderabad",
                "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Bengaluru",
                "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Chennai",
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Mumbai",
                "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Delhi NCR",
                "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Pune",
                "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Visakhapatnam",
                "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
              ],
              [
                "Vijayawada",
                "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=85",
              ],
            ].map(([city, image]) => (

              <button
                key={city}
                className="city-card"
                onClick={() =>
                  chooseCity(city)
                }
              >

                <img
                  src={image}
                  alt={city}
                />

                <span></span>

                <div>

                  <strong>
                    {city}
                  </strong>

                  <small>
                    Explore properties →
                  </small>

                </div>

              </button>

            ))}

          </div>

        </section>

        {/* HIGH TRUST SCORE PROPERTIES */}
        <section
          className="section-block"
          id="verified"
        >

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                HIGH CONFIDENCE
              </span>

              <h2>
                High Trust Score Properties
              </h2>

              <p>
                Start your search with listings
                showing stronger verification signals.
              </p>

            </div>

          </div>

          <div className="property-grid">

            {[...properties]
              .sort(
                (a, b) =>
                  (b.trustScore || 0) -
                  (a.trustScore || 0)
              )
              .slice(0, 3)
              .map((property) => (

                <PropertyCard
                  key={`trust-${property._id}`}
                  property={property}
                  onOpen={openProperty}
                />

              ))}

          </div>

        </section>

        {/* 50 REAL DATABASE PROPERTIES */}
        <section
          className="section-block"
          id="real-properties"
        >

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                EXPLORE REAL ESTATE
              </span>

              <h2>
                50 Real Properties
              </h2>

              <p>
                Real houses, villas, apartments, plots and
                commercial properties from our database.
              </p>

            </div>

          </div>

          {loading ? (
            <div className="loading-text">
              Loading real properties...
            </div>
          ) : (
            <div className="property-grid">

              {properties
                .filter(
                  (property) =>
                    property?._id &&
                    !/^p\d+$/i.test(
                      String(property._id)
                    )
                )
                .slice(0, 50)
                .map((property) => (
                  <PropertyCard
                    key={`real-${property._id}`}
                    property={property}
                    onOpen={openProperty}
                  />
                ))}

            </div>
          )}

          {!loading &&
            properties.length === 0 && (
              <div className="empty-state">

                <div>⌕</div>

                <h3>
                  No real properties available
                </h3>

                <p>
                  Please check the database connection and
                  try again.
                </p>

              </div>
            )}

        </section>
         <Reviews />

        {/* OWNER CTA */}
        <section className="owner-cta">

          <div>

            <span>
              SELL OR RENT YOUR PROPERTY
            </span>

            <h2>
              Ready to find the right person
              for your property?
            </h2>

            <p>
              Post your property free and reach
              people actively searching in your
              location.
            </p>

          </div>

          <a href="/post-property">
            Post Property Free →
          </a>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="rf-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <a
              href="/"
              className="rf-logo footer-logo"
            >

              <span className="logo-mark">
                R
              </span>

              <div>

                <strong>
                  RealFinder
                </strong>

                <small>
                  Property Intelligence
                </small>

              </div>

            </a>

            <p>
              Making property discovery more
              transparent, intelligent and
              trustworthy.
            </p>

          </div>

          <div className="footer-col">

            <h4>
              For Buyers
            </h4>

            <a href="/buy">
              Buy Property
            </a>

            <a href="/new-projects">
              New Projects
            </a>

            <a href="/plots-land">
              Plots & Land
            </a>

            <a href="/shortlisted">
              Shortlisted
            </a>

          </div>

          <div className="footer-col">

            <h4>
              For Tenants
            </h4>

            <a href="/rent">
              Rent Property
            </a>

            <a href="/rent">
              Rental Homes
            </a>

            <a href="/rent">
              PG & Shared
            </a>

          </div>

          <div className="footer-col">

            <h4>
              For Owners
            </h4>

            <a href="/post-property">
              Post Property
            </a>

            <a href="/sell">
              Sell Property
            </a>

            <a href="/contact">
              Owner Support
            </a>

          </div>

          <div className="footer-col">

            <h4>
              Dealers & Builders
            </h4>

            <a href="/post-property">
              List Project
            </a>

            <a href="/commercial">
              Commercial
            </a>

            <a href="/contact">
              Business Support
            </a>

          </div>

          <div className="footer-col">

            <h4>
              Company
            </h4>

            <a href="/about">
              About Us
            </a>

            <a href="/insights">
              Insights
            </a>

            <a href="/contact">
              Contact
            </a>

            <a href="/privacy">
              Privacy
            </a>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 RealFinder.
            All rights reserved.
          </span>

          <span>
            Built for smarter property decisions.
          </span>

        </div>

      </footer>

    </div>
  );
}