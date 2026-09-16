import Lead from "../models/Lead.js";
import Property from "../models/Property.js";

function withTimeline(status, note = "") {
  return {
    status,
    note,
    at: new Date(),
  };
}

// Public: create enquiry lead from property details form
export const createLead = async (req, res) => {
  try {
    const { propertyId, name, phone, message, preferredVisitAt } = req.body || {};

    if (!propertyId) return res.status(400).json({ message: "propertyId is required" });
    if (!name) return res.status(400).json({ message: "name is required" });
    if (!phone) return res.status(400).json({ message: "phone is required" });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const lead = await Lead.create({
      property: property._id,
      user: req.user?._id || null,
      name,
      phone,
      message: message || "",
      preferredVisitAt: preferredVisitAt ? new Date(preferredVisitAt) : null,
      status: "new",
      timeline: [withTimeline("new", "Enquiry created")],
    });

    // Return populated property for better UI ("Contacted" screen)
    const populatedLead = await Lead.findById(lead._id).populate("property");
    res.json(populatedLead || lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected: list my leads (for user)
export const getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ user: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public demo: show recent leads (so tracking works even with mock login)
export const getRecentLeads = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(5, Number(req.query.limit) || 20));
    const leads = await Lead.find()
      .populate("property")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected: update lead status (simple demo; later add role-based agent/admin)
export const updateLeadStatus = async (req, res) => {
  try {
    const { status, note = "" } = req.body || {};
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only owner user can update their lead in this demo
    if (lead.user && lead.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (status) {
      lead.status = status;
      lead.timeline.push(withTimeline(status, note));
    }

    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

