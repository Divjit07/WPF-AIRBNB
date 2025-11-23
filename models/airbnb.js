const mongoose = require("mongoose");

// Flexible schema to match your imported CSV/JSON data
const AirbnbSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Listing", AirbnbSchema, "Airbnb_Listings");
