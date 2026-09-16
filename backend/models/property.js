import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    // Listing type
    listingType: { type: String, enum: ["sale", "rent"], default: "sale" },
    price: { type: Number, required: true }, // sale price or monthly rent (see listingType)

    // Location
    location: { type: String, required: true, trim: true }, // "Area, City"
    city: { type: String, default: "", trim: true },
    locality: { type: String, default: "", trim: true },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    // Media
    image: { type: String, default: "" }, // primary image (cloudinary URL)
    images: { type: [String], default: [] }, // gallery

    // Specs
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqft: { type: Number, default: 0 },
    area: { type: String, default: "" }, // kept for backward compatibility

    category: {
      type: String,
      enum: ["apartment", "villa", "independent-house", "plot", "office", "shop", "builder-floor"],
      default: "apartment",
    },

    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      default: "unfurnished",
    },
    parking: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    reraId: { type: String, default: "", trim: true },

    // 99acres-style "posted by"
    advertiserType: {
      type: String,
      enum: ["owner", "dealer", "builder"],
      default: "owner",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;