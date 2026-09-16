import User from "../models/User.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.json({ message: "User not found" });

  if (!user.wishlist.includes(req.params.id)) {
    user.wishlist.push(req.params.id);
  }

  await user.save();

  res.json(user.wishlist);
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.json({ message: "User not found" });

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== req.params.id
  );

  await user.save();

  res.json(user.wishlist);
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) return res.json({ message: "User not found" });

  res.json(user.wishlist);
};