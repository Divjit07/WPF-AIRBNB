const Listing = require("../models/airbnb");
const mongoose = require("mongoose");

// =======================
// GET ALL LISTINGS
// =======================
exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const listings = await Listing.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: listings.length,
      page,
      limit,
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// GET ONE LISTING (by numeric ID or _id)
// =======================
exports.getOne = async (req, res, next) => {
  try {
    const param = req.params.id;

    let listing;

    // If numeric → search dataset ID
    if (!isNaN(param)) {
      listing = await Listing.findOne({ id: Number(param) }).lean();
    }
    // If valid ObjectId → search MongoDB _id
    else if (mongoose.Types.ObjectId.isValid(param)) {
      listing = await Listing.findById(param).lean();
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// =======================
// CREATE NEW LISTING
// =======================
exports.create = async (req, res, next) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    next(err);
  }
};

// =======================
// UPDATE LISTING (title + price or anything)
// =======================
exports.update = async (req, res, next) => {
  try {
    const param = req.params.id;
    let updated;

    if (!isNaN(param)) {
      updated = await Listing.findOneAndUpdate(
        { id: Number(param) },
        req.body,
        { new: true }
      );
    } else if (mongoose.Types.ObjectId.isValid(param)) {
      updated = await Listing.findByIdAndUpdate(param, req.body, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// =======================
// DELETE LISTING
// =======================
exports.remove = async (req, res, next) => {
  try {
    const param = req.params.id;
    let deleted;

    if (!isNaN(param)) {
      deleted = await Listing.findOneAndDelete({ id: Number(param) });
    } else if (mongoose.Types.ObjectId.isValid(param)) {
      deleted = await Listing.findByIdAndDelete(param);
    }

    if (!deleted) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
