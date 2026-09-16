import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingForm from "../components/booking/BookingForm";

const API = "http://localhost:5000/api/properties";

function PropertyView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // First try the real MongoDB property ID.
        const res = await fetch(`${API}/${id}`);

        if (res.ok) {
          const data = await res.json();
          setProperty(data.property || data);
          return;
        }

        // Home/fallback cards can use IDs such as p1, p2, p3...
        if (String(id).match(/^p(\d+)$/i)) {
          const fallbackMatch = String(id).match(/^p(\d+)$/i);
          const index = Number(fallbackMatch[1]) - 1;

          const listRes = await fetch(`${API}?limit=100`);

          if (!listRes.ok) {
            throw new Error("Could not load properties");
          }

          const listData = await listRes.json();

          const allProperties = Array.isArray(listData)
            ? listData
            : Array.isArray(listData.items)
            ? listData.items
            : Array.isArray(listData.properties)
            ? listData.properties
            : [];

          if (allProperties[index]) {
            setProperty(allProperties[index]);
            return;
          }
        }

        throw new Error("Property not found");
      } catch (error) {
        console.error("PROPERTY VIEW ERROR:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const money = (value) => {
    if (!value) return "Price on Request";

    const num = Number(value);

    if (Number.isNaN(num)) return value;

    return `₹${num.toLocaleString("en-IN")}`;
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    return `http://localhost:5000/${image}`;
  };

  // CONTACT OWNER / SEND ENQUIRY
  const openContactOwner = () => {
    navigate(`/contact-owner/${property?._id || id}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader}></div>
        <h3>Loading property...</h3>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={styles.notFound}>
        <h2>Property not found</h2>

        <p>
          This property may have been removed or is unavailable.
        </p>

        <button
          onClick={() => navigate(-1)}
          style={styles.primaryButton}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : Array.isArray(property.photos) && property.photos.length > 0
      ? property.photos
      : property.image
      ? [property.image]
      : [];

  const title =
    property.title ||
    property.name ||
    `${property.bedrooms || ""} BHK ${
      property.propertyType || "Property"
    }`;

  const location =
    property.location ||
    property.address ||
    property.locality ||
    property.city ||
    "Location not available";

  const bedrooms =
    property.bedrooms ??
    property.bhk ??
    property.BHK ??
    "—";

  const bathrooms =
    property.bathrooms ??
    property.baths ??
    "—";

  const area =
    property.areaSqft ??
    property.area ??
    property.builtUpArea ??
    property.built_up_area ??
    property.size ??
    "—";

  const propertyType =
    property.propertyType ||
    property.type ||
    property.category ||
    "Property";

  const parking =
    property.parking ||
    property.parkingSpaces ||
    "—";

  const floor =
    property.floor ||
    property.floorNumber ||
    property.floorNo ||
    "—";

  const purpose =
    property.purpose ||
    property.listingType ||
    "Sale";

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <header style={styles.navbar}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⌂</span>
          <span>RealEstate</span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/buy" style={styles.navLink}>
            Buy
          </Link>

          <Link to="/rent" style={styles.navLink}>
            Rent
          </Link>

          <Link to="/sell" style={styles.navLink}>
            Sell
          </Link>

          <Link to="/new-projects" style={styles.navLink}>
            New Projects
          </Link>

          <Link to="/commercial" style={styles.navLink}>
            Commercial
          </Link>
        </nav>

        <Link
          to="/add-property"
          style={styles.postButton}
        >
          Post Property FREE
        </Link>
      </header>

      {/* CONTENT */}
      <main style={styles.container}>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <Link
            to="/"
            style={styles.breadLink}
          >
            Home
          </Link>

          <span>›</span>

          <span>{location}</span>

          <span>›</span>

          <span>{title}</span>
        </div>

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back to Search
        </button>

        {/* TITLE */}
        <section style={styles.titleSection}>
          <div>
            <div style={styles.tags}>
              <span style={styles.saleTag}>
                {purpose}
              </span>

              <span style={styles.verifiedTag}>
                ✓ Verified Property
              </span>
            </div>

            <h1 style={styles.title}>
              {title}
            </h1>

            <p style={styles.location}>
              📍 {location}
            </p>
          </div>

          <div style={styles.priceBox}>
            <div style={styles.price}>
              {money(property.price)}
            </div>

            {area && (
              <div style={styles.priceSub}>
                {area} sqft
              </div>
            )}
          </div>
        </section>

        {/* IMAGE GALLERY */}
        <section style={styles.gallery}>
          <div style={styles.mainImageBox}>
            {images.length > 0 ? (
              <img
                src={getImageUrl(images[activeImage])}
                alt={title}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.noImage}>
                <div style={{ fontSize: 55 }}>
                  🏠
                </div>

                <span>
                  No property image available
                </span>
              </div>
            )}

            {images.length > 1 && (
              <div style={styles.imageCounter}>
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div style={styles.thumbnailColumn}>
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setActiveImage(index)
                  }
                  style={{
                    ...styles.thumbnailButton,
                    ...(activeImage === index
                      ? styles.activeThumbnail
                      : {}),
                  }}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Property ${index + 1}`}
                    style={styles.thumbnail}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* HIGHLIGHTS */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Property Highlights
          </h2>

          <div style={styles.highlights}>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                🛏️
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {bedrooms}
                </div>

                <div style={styles.highlightLabel}>
                  Bedrooms
                </div>
              </div>
            </div>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                🛁
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {bathrooms}
                </div>

                <div style={styles.highlightLabel}>
                  Bathrooms
                </div>
              </div>
            </div>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                📐
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {area}
                </div>

                <div style={styles.highlightLabel}>
                  Built-up Area
                </div>
              </div>
            </div>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                🏢
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {propertyType}
                </div>

                <div style={styles.highlightLabel}>
                  Property Type
                </div>
              </div>
            </div>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                🚗
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {parking}
                </div>

                <div style={styles.highlightLabel}>
                  Parking
                </div>
              </div>
            </div>

            <div style={styles.highlight}>
              <div style={styles.highlightIcon}>
                🏬
              </div>

              <div>
                <div style={styles.highlightValue}>
                  {floor}
                </div>

                <div style={styles.highlightLabel}>
                  Floor
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ABOUT + CONTACT */}
        <div style={styles.twoColumn}>

          <div>

            {/* ABOUT */}
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                About This Property
              </h2>

              <p style={styles.description}>
                {property.description ||
                  `This beautiful ${bedrooms} BHK ${propertyType} is located in ${location}. The property offers comfortable living space and convenient access to nearby facilities.`}
              </p>

              <div style={styles.detailsGrid}>

                <div>
                  <span style={styles.detailLabel}>
                    Property ID
                  </span>

                  <strong>
                    {property._id || id}
                  </strong>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Listing Type
                  </span>

                  <strong>
                    {purpose}
                  </strong>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Property Type
                  </span>

                  <strong>
                    {propertyType}
                  </strong>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Area
                  </span>

                  <strong>
                    {area}
                  </strong>
                </div>

              </div>
            </section>

            {/* LOCATION */}
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                Location & Address
              </h2>

              <div style={styles.addressBox}>
                <div style={styles.addressIcon}>
                  📍
                </div>

                <div>
                  <strong>
                    {location}
                  </strong>

                  <p style={styles.addressText}>
                    {property.address ||
                      property.fullAddress ||
                      location}
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* CONTACT CARD */}
          <aside style={styles.contactCard}>

            <div style={styles.contactIcon}>
              👤
            </div>

            <h2 style={styles.contactTitle}>
              Interested in this property?
            </h2>

            <p style={styles.contactText}>
              Contact the owner or send an enquiry
              to know more about this property.
            </p>

            {/* CONTACT OWNER */}
            <button
              onClick={openContactOwner}
              style={styles.contactButton}
            >
              📞 Contact Owner
            </button>

            {/* SEND ENQUIRY */}
            <button
              onClick={openContactOwner}
              style={styles.enquiryButton}
            >
              ✉ Send Enquiry
            </button>

            <div style={styles.safeBox}>
              <strong>
                🛡️ Stay Safe
              </strong>

              <p>
                Never share your financial or OTP
                details with anyone.
              </p>
            </div>

          </aside>
        </div>

        {/* BOOK PROPERTY VISIT */}
        <section style={styles.bookingSection}>
          <BookingForm
            propertyId={property?._id || id}
            propertyTitle={title}
          />
        </section>

      </main>

      {/* BOTTOM ACTION BAR */}
      <div style={styles.bottomBar}>

        <div>
          <strong style={styles.bottomPrice}>
            {money(property.price)}
          </strong>

          <span style={styles.bottomLocation}>
            📍 {location}
          </span>
        </div>

        <div style={styles.bottomActions}>

          {/* BOTTOM CONTACT */}
          <button
            onClick={openContactOwner}
            style={styles.bottomContact}
          >
            📞 Contact
          </button>

          {/* BOTTOM ENQUIRY */}
          <button
            onClick={openContactOwner}
            style={styles.bottomEnquiry}
          >
            ✉ Send Enquiry
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
    paddingBottom: "90px",
  },

  navbar: {
    height: "72px",
    background: "#ffffff",
    borderBottom: "1px solid #e7eaf0",
    display: "flex",
    alignItems: "center",
    padding: "0 6%",
    gap: "35px",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#e53935",
    textDecoration: "none",
    marginRight: "15px",
  },

  logoIcon: {
    fontSize: "28px",
  },

  nav: {
    display: "flex",
    gap: "28px",
    flex: 1,
  },

  navLink: {
    color: "#384152",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
  },

  postButton: {
    background: "#e53935",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
  },

  container: {
    width: "88%",
    maxWidth: "1250px",
    margin: "0 auto",
  },

  breadcrumb: {
    display: "flex",
    gap: "8px",
    padding: "22px 0 10px",
    color: "#7a8495",
    fontSize: "13px",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },

  breadLink: {
    color: "#e53935",
    textDecoration: "none",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#e53935",
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px 0",
    fontSize: "14px",
  },

  titleSection: {
    background: "#fff",
    borderRadius: "14px",
    padding: "25px 30px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 2px 12px rgba(20,30,50,0.05)",
  },

  tags: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },

  saleTag: {
    background: "#fff1f0",
    color: "#d93025",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
  },

  verifiedTag: {
    background: "#ecfdf3",
    color: "#16834a",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
  },

  title: {
    margin: "0",
    fontSize: "30px",
    lineHeight: 1.25,
    fontWeight: 800,
  },

  location: {
    margin: "10px 0 0",
    color: "#667085",
    fontSize: "15px",
  },

  priceBox: {
    textAlign: "right",
    minWidth: "180px",
  },

  price: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#e53935",
  },

  priceSub: {
    color: "#7b8494",
    marginTop: "5px",
    fontSize: "13px",
  },

  gallery: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 110px",
    gap: "12px",
    height: "480px",
  },

  mainImageBox: {
    background: "#e9edf3",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#7a8495",
    gap: "10px",
  },

  imageCounter: {
    position: "absolute",
    right: "15px",
    bottom: "15px",
    background: "rgba(0,0,0,.65)",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  thumbnailColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  thumbnailButton: {
    padding: 0,
    border: "2px solid transparent",
    borderRadius: "9px",
    overflow: "hidden",
    background: "#fff",
    cursor: "pointer",
    height: "82px",
  },

  activeThumbnail: {
    border: "2px solid #e53935",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "26px",
    marginTop: "20px",
    boxShadow:
      "0 2px 12px rgba(20,30,50,0.05)",
  },

  sectionTitle: {
    margin: "0 0 20px",
    fontSize: "21px",
    fontWeight: 800,
  },

  highlights: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "20px",
  },

  highlight: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "15px",
    background: "#f8f9fb",
    borderRadius: "10px",
  },

  highlightIcon: {
    fontSize: "25px",
  },

  highlightValue: {
    fontWeight: 800,
    fontSize: "15px",
  },

  highlightLabel: {
    color: "#7a8495",
    fontSize: "12px",
    marginTop: "3px",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "1fr 350px",
    gap: "20px",
    alignItems: "start",
  },

  description: {
    color: "#5d6675",
    lineHeight: 1.8,
    fontSize: "15px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop:
      "1px solid #edf0f4",
  },

  detailLabel: {
    display: "block",
    color: "#8a93a2",
    fontSize: "12px",
    marginBottom: "5px",
  },

  addressBox: {
    display: "flex",
    gap: "15px",
    background: "#f8f9fb",
    padding: "18px",
    borderRadius: "10px",
  },

  addressIcon: {
    fontSize: "25px",
  },

  addressText: {
    margin: "7px 0 0",
    color: "#667085",
    fontSize: "14px",
  },

  contactCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    marginTop: "20px",
    boxShadow:
      "0 3px 15px rgba(20,30,50,0.08)",
    position: "sticky",
    top: "95px",
  },

  contactIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#fff1f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "15px",
  },

  contactTitle: {
    fontSize: "20px",
    margin: "0 0 10px",
  },

  contactText: {
    color: "#707989",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  contactButton: {
    width: "100%",
    border: "none",
    background: "#e53935",
    color: "#fff",
    padding: "14px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "15px",
  },

  enquiryButton: {
    width: "100%",
    border: "1px solid #e53935",
    background: "#fff",
    color: "#e53935",
    padding: "14px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px",
  },

  safeBox: {
    marginTop: "20px",
    background: "#f8f9fb",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "13px",
  },

  /* BOOKING */
  bookingSection: {
    marginTop: "25px",
    marginBottom: "30px",
  },

  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#fff",
    borderTop:
      "1px solid #e5e7eb",
    boxShadow:
      "0 -4px 18px rgba(0,0,0,.08)",
    minHeight: "72px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "10px 6%",
    zIndex: 100,
  },

  bottomPrice: {
    color: "#e53935",
    fontSize: "20px",
    marginRight: "15px",
  },

  bottomLocation: {
    color: "#707989",
    fontSize: "13px",
  },

  bottomActions: {
    display: "flex",
    gap: "10px",
  },

  bottomContact: {
    border:
      "1px solid #e53935",
    background: "#fff",
    color: "#e53935",
    padding: "12px 22px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  bottomEnquiry: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },

  loader: {
    width: "35px",
    height: "35px",
    border: "4px solid #eee",
    borderTop:
      "4px solid #e53935",
    borderRadius: "50%",
    marginBottom: "15px",
  },

  notFound: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },

  primaryButton: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default PropertyView;