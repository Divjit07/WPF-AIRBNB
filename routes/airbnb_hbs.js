const express = require("express");
const router = express.Router();
const Listing = require("../models/airbnb");

// -----------------------------------------
// HOME PAGE
// -----------------------------------------
router.get("/", (req, res) => {
  res.render("home");
});

// -----------------------------------------
// SHOW ALL LISTINGS (with pagination)
// -----------------------------------------
router.get("/list", async (req, res, next) => {
  try {
    const perPage = 20;
    const page = parseInt(req.query.page) || 1;

    const total = await Listing.countDocuments();
    const listings = await Listing.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    res.render("allListings", {
      listings,
      currentPage: page,
      hasNextPage: page * perPage < total,
      hasPreviousPage: page > 1
    });

  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// VIEW SINGLE LISTING
// -----------------------------------------
router.get("/view/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ id: Number(req.params.id) }).lean();

    res.render("singleListing", { listing });
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// ADD LISTING (FORM PAGE)
// -----------------------------------------
router.get("/add", (req, res) => {
  res.render("addListing");
});

// -----------------------------------------
// SUBMIT NEW LISTING (POST)
// -----------------------------------------
router.post("/add", async (req, res, next) => {
  try {
    // If ID is provided as string, convert to number
    if (req.body.id) {
      req.body.id = Number(req.body.id);
    }

    await Listing.create(req.body);
    res.redirect("/airbnb_hbs/list");
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// SEARCH LISTING (BY ID OR NAME)
// -----------------------------------------
router.get("/search", async (req, res, next) => {
  try {
    const method = req.query.method;  // id or name
    const value = req.query.value;

    if (!method || !value) {
      return res.render("searchListing", { method });
    }

    let listing = null;

    if (method === "id") {
      listing = await Listing.findOne({ id: Number(value) }).lean();
    } 
    else if (method === "name") {
      listing = await Listing.findOne({
        NAME: { $regex: value, $options: "i" }
      }).lean();
    }

    res.render("searchListing", { method, value, listing });

  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// UPDATE LISTING (SEARCH PAGE)
// -----------------------------------------
router.get("/update", async (req, res, next) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.render("updateListing");
    }

    const listing = await Listing.findOne({ id: Number(id) }).lean();
    res.render("updateListing", { listing, id });

  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// UPDATE LISTING SUBMIT
// -----------------------------------------
router.post("/update/:id", async (req, res, next) => {
  try {
    const idNum = Number(req.params.id);

    await Listing.findOneAndUpdate(
      { id: idNum },
      req.body,
      { new: true }
    );

    res.redirect(`/airbnb_hbs/view/${idNum}`);
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// DELETE LISTING (SEARCH PAGE)
// -----------------------------------------
router.get("/delete", async (req, res, next) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.render("deleteListing");
    }

    const listing = await Listing.findOne({ id: Number(id) }).lean();
    res.render("deleteListing", { listing, id });

  } catch (err) {
    next(err);
  }
});

// -----------------------------------------
// DELETE LISTING SUBMIT
// -----------------------------------------
router.post("/delete/:id", async (req, res, next) => {
  try {
    await Listing.findOneAndDelete({ id: Number(req.params.id) });
    res.redirect("/airbnb_hbs/list");
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// ===============
// FAVOURITES STORAGE (TEMP MEMORY)
// ===============
let favourites = [];


// ===============
// ADD LISTING TO FAVOURITES
// ===============
router.get("/favourites/add/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ id: Number(req.params.id) }).lean();

    if (!listing) {
      return res.render("favourites", { error: "Listing not found." });
    }

    // Check duplicate
    const exists = favourites.find(item => item.id === listing.id);
    if (!exists) {
      favourites.push(listing);
    }

    res.redirect("/airbnb_hbs/favourites");
  } catch (err) {
    next(err);
  }
});


// ===============
// REMOVE FAVOURITE
// ===============
router.get("/favourites/remove/:id", (req, res) => {
  const idNumber = Number(req.params.id);

  favourites = favourites.filter(item => item.id !== idNumber);

  res.redirect("/airbnb_hbs/favourites");
});


// ===============
// SHOW ALL FAVOURITES
// ===============
router.get("/favourites", (req, res) => {
  res.render("favourites", { favourites });
});
