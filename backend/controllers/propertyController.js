import Property from "../models/Property.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PROPERTY (WITH IMAGE UPLOAD)
export const createProperty = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "properties" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: error.message });
          }

          imageUrl = result.secure_url;

          const property = await Property.create({
            ...req.body,
            image: imageUrl,
            user: req.user._id,
          });

          res.json(property);
        }
      );

      stream.end(req.file.buffer);
    } else {
      const property = await Property.create({
        ...req.body,
        user: req.user._id,
      });

      res.json(property);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "24",
      q = "",
      city = "",
      category = "",
      listingType = "",
      minPrice = "",
      maxPrice = "",
      bedrooms = "",
      verified = "",
      sort = "newest",
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(60, Math.max(6, Number(limit) || 24));

    const filter = {};

    if (q) {
      const rx = new RegExp(String(q).trim(), "i");

      filter.$or = [
        { title: rx },
        { location: rx },
        { city: rx },
        { locality: rx },
      ];
    }

    if (city) {
      filter.city = new RegExp(`^${String(city).trim()}$`, "i");
    }

    if (category) {
      filter.category = String(category).trim();
    }

    if (listingType) {
      filter.listingType = String(listingType).trim();
    }

    if (bedrooms !== "") {
      filter.bedrooms = Number(bedrooms) || 0;
    }

    if (verified === "true") {
      filter.verified = true;
    }

    if (minPrice !== "" || maxPrice !== "") {
      filter.price = {};

      if (minPrice !== "") {
        filter.price.$gte = Number(minPrice) || 0;
      }

      if (maxPrice !== "") {
        filter.price.$lte = Number(maxPrice) || 0;
      }
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      areaHigh: { areaSqft: -1 },
      featured: {
        featured: -1,
        verified: -1,
        createdAt: -1,
      },
    };

    const sortObj = sortMap[sort] || sortMap.newest;

    const total = await Property.countDocuments(filter);

    const items = await Property.find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY PROPERTIES
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      items: properties,
      total: properties.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CITY-WISE STATS (category counts etc.)
export const getPropertyStats = async (req, res) => {
  try {
    const {
      city = "",
      listingType = "",
    } = req.query;

    const match = {};

    if (city) {
      match.city = new RegExp(
        `^${String(city).trim()}$`,
        "i"
      );
    }

    if (listingType) {
      match.listingType = String(listingType).trim();
    }

    const categoryCounts = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    const bhkCounts = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$bedrooms",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const advertiserCounts = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$advertiserType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json({
      city: city || "All",
      listingType: listingType || "all",
      categoryCounts,
      bhkCounts,
      advertiserCounts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TOP LOCALITIES
// Proxy for "most searched" based on inventory share
export const getLocalityTrends = async (req, res) => {
  try {
    const {
      city = "",
      category = "",
      listingType = "",
      limit = "5",
    } = req.query;

    const match = {};

    if (city) {
      match.city = new RegExp(
        `^${String(city).trim()}$`,
        "i"
      );
    }

    if (category) {
      match.category = String(category).trim();
    }

    if (listingType) {
      match.listingType = String(listingType).trim();
    }

    const limitNum = Math.min(
      15,
      Math.max(3, Number(limit) || 5)
    );

    const total = await Property.countDocuments(match);

    const rows = await Property.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$locality",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: limitNum,
      },
    ]);

    const items = rows
      .filter((r) => r._id)
      .map((r) => ({
        locality: r._id,
        count: r.count,
        percent:
          total > 0
            ? Math.round((r.count / total) * 100)
            : 0,
      }));

    res.json({
      city: city || "All",
      category: category || "all",
      listingType: listingType || "all",
      total,
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PROPERTY
export const getPropertyById = async (req, res) => {
  try {
    const data = await Property.findById(req.params.id);

    if (!data) {
      return res.json({
        message: "Not found",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    const data = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};