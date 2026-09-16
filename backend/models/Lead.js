import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "site_visit_scheduled",
        "site_visit_done",
        "negotiation",
        "token_paid",
        "closed_won",
        "closed_lost",
      ],
      default: "new",
    },
    timeline: {
      type: [
        {
          status: String,
          note: String,
          at: Date,
        },
      ],
      default: [],
    },

    preferredVisitAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;

