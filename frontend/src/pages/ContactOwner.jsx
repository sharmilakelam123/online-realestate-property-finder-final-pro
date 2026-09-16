import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API = "http://localhost:5000/api";

function ContactOwner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
    preferredVisitAt: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/properties/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Property not found");
        }

        setProperty(data.property || data);
      } catch (err) {
        console.error("CONTACT PROPERTY ERROR:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    return `http://localhost:5000/${image}`;
  };

  const money = (value) => {
    if (!value) return "Price on Request";

    const num = Number(value);

    if (Number.isNaN(num)) return value;

    return `₹${num.toLocaleString("en-IN")}`;
  };

  const images =
    Array.isArray(property?.images) && property.images.length > 0
      ? property.images
      : Array.isArray(property?.photos) && property.photos.length > 0
      ? property.photos
      : property?.image
      ? [property.image]
      : [];

  const title =
    property?.title ||
    property?.name ||
    `${property?.bedrooms || ""} BHK Property`;

  const location =
    property?.location ||
    property?.address ||
    property?.locality ||
    property?.city ||
    "Location not available";

  const area =
    property?.areaSqft ||
    property?.area ||
    property?.builtUpArea ||
    property?.size ||
    "";

  const propertyType =
    property?.propertyType ||
    property?.category ||
    property?.type ||
    "Property";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");

    return /^(?:91)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid Indian mobile number.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: id,
          name,
          phone,
          message,
          preferredVisitAt: form.preferredVisitAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Could not send enquiry");
      }

      console.log("ENQUIRY CREATED:", data);

      setSuccess(true);
    } catch (err) {
      console.error("SEND ENQUIRY ERROR:", err);

      setError(
        err.message || "Something went wrong while sending your enquiry."
      );
    } finally {
      setSubmitting(false);
    }
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
        <div style={styles.notFoundIcon}>🏠</div>
        <h2>Property not found</h2>
        <p>This property may have been removed or is unavailable.</p>

        <button
          onClick={() => navigate(-1)}
          style={styles.primaryButton}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
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

          <Link to="/add-property" style={styles.postButton}>
            Post Property FREE
          </Link>
        </header>

        <main style={styles.successContainer}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✓</div>

            <h1 style={styles.successTitle}>
              Enquiry Sent Successfully!
            </h1>

            <p style={styles.successText}>
              Your enquiry has been sent successfully. The property owner
              can now contact you regarding this property.
            </p>

            <div style={styles.successProperty}>
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[0])}
                  alt={title}
                  style={styles.successImage}
                />
              ) : (
                <div style={styles.successNoImage}>🏠</div>
              )}

              <div>
                <h3 style={styles.successPropertyTitle}>{title}</h3>

                <p style={styles.successLocation}>
                  📍 {location}
                </p>

                <strong style={styles.successPrice}>
                  {money(property.price)}
                </strong>
              </div>
            </div>

            <div style={styles.successActions}>
              <button
                onClick={() => navigate(`/property/${property._id || id}`)}
                style={styles.primaryButton}
              >
                View Property
              </button>

              <button
                onClick={() => navigate("/")}
                style={styles.secondaryButton}
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
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

        <Link to="/add-property" style={styles.postButton}>
          Post Property FREE
        </Link>
      </header>

      <main style={styles.container}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back to Property
        </button>

        <div style={styles.pageTitle}>
          <span style={styles.eyebrow}>PROPERTY ENQUIRY</span>

          <h1>Contact Owner</h1>

          <p>
            Send an enquiry to know more about this property.
          </p>
        </div>

        <div style={styles.content}>
          <section style={styles.propertyCard}>
            <div style={styles.propertyImageBox}>
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[0])}
                  alt={title}
                  style={styles.propertyImage}
                />
              ) : (
                <div style={styles.noImage}>
                  <span>🏠</span>
                  <small>No image available</small>
                </div>
              )}
            </div>

            <div style={styles.propertyInfo}>
              <span style={styles.verified}>✓ Verified Property</span>

              <h2>{title}</h2>

              <p style={styles.locationText}>
                📍 {location}
              </p>

              <div style={styles.propertyMeta}>
                {property?.bedrooms != null && (
                  <span>🛏 {property.bedrooms} BHK</span>
                )}

                {area && (
                  <span>📐 {area} sqft</span>
                )}

                <span>🏢 {propertyType}</span>
              </div>

              <div style={styles.propertyPrice}>
                {money(property.price)}
              </div>
            </div>
          </section>

          <section style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.formIcon}>👤</div>

              <div>
                <h2>Your Contact Details</h2>

                <p>
                  Fill in your details and the owner will get in touch
                  with you.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

              <div style={styles.field}>
                <label>
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                />

                <small>
                  We will use this number to contact you regarding the
                  property.
                </small>
              </div>

              <div style={styles.field}>
                <label>Message</label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="I am interested in this property. Please share more details..."
                  rows="5"
                />
              </div>

              <div style={styles.field}>
                <label>Preferred Visit Date & Time</label>

                <input
                  type="datetime-local"
                  name="preferredVisitAt"
                  value={form.preferredVisitAt}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <strong>⚠</strong>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitButton,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Sending Enquiry..." : "✉ Send Enquiry"}
              </button>

              <p style={styles.safeText}>
                🛡️ Your information is used only to connect you with
                the property owner.
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    paddingBottom: "50px",
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
    maxWidth: "1100px",
    margin: "0 auto",
    paddingTop: "25px",
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

  pageTitle: {
    marginTop: "15px",
    marginBottom: "25px",
  },

  eyebrow: {
    color: "#e53935",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  pageTitleH1: {
    margin: "7px 0",
  },

  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    alignItems: "start",
  },

  propertyCard: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 3px 15px rgba(20,30,50,0.07)",
  },

  propertyImageBox: {
    height: "300px",
    background: "#e9edf3",
  },

  propertyImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  noImage: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    color: "#7a8495",
  },

  propertyInfo: {
    padding: "24px",
  },

  verified: {
    display: "inline-block",
    background: "#ecfdf3",
    color: "#16834a",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  },

  locationText: {
    color: "#667085",
    fontSize: "14px",
    margin: "8px 0 15px",
  },

  propertyMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  propertyMetaSpan: {
    background: "#f5f7fb",
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#596273",
  },

  propertyPrice: {
    color: "#e53935",
    fontWeight: 800,
    fontSize: "23px",
    marginTop: "20px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 3px 15px rgba(20,30,50,0.07)",
  },

  formHeader: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #edf0f4",
  },

  formIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#fff1f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  field: {
    marginBottom: "18px",
  },

  errorBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    background: "#fff1f0",
    color: "#c62828",
    border: "1px solid #ffcaca",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "13px",
  },

  submitButton: {
    width: "100%",
    border: "none",
    background: "#e53935",
    color: "#fff",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: 800,
    fontSize: "15px",
    cursor: "pointer",
  },

  safeText: {
    color: "#7a8495",
    fontSize: "12px",
    lineHeight: 1.5,
    textAlign: "center",
    margin: "15px 0 0",
  },

  successContainer: {
    width: "88%",
    maxWidth: "700px",
    margin: "0 auto",
    paddingTop: "60px",
  },

  successCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 3px 18px rgba(20,30,50,0.08)",
  },

  successIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#ecfdf3",
    color: "#16834a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    fontWeight: 800,
    margin: "0 auto 20px",
  },

  successTitle: {
    margin: "0 0 12px",
    fontSize: "27px",
  },

  successText: {
    color: "#667085",
    lineHeight: 1.7,
  },

  successProperty: {
    display: "flex",
    gap: "15px",
    textAlign: "left",
    background: "#f8f9fb",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "25px",
  },

  successImage: {
    width: "120px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },

  successNoImage: {
    width: "120px",
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e9edf3",
    borderRadius: "8px",
    fontSize: "30px",
    flexShrink: 0,
  },

  successPropertyTitle: {
    margin: "0 0 6px",
    fontSize: "15px",
  },

  successLocation: {
    margin: "0 0 8px",
    color: "#667085",
    fontSize: "13px",
  },

  successPrice: {
    color: "#e53935",
  },

  successActions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "25px",
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

  secondaryButton: {
    border: "1px solid #e53935",
    background: "#fff",
    color: "#e53935",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
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
    borderTop: "4px solid #e53935",
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

  notFoundIcon: {
    fontSize: "55px",
  },
};

export default ContactOwner;