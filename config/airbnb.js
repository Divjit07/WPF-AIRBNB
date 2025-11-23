/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Divjit Student ID: N01719435 Date: Nov 19,2025
*
*
******************************************************************************
**/


require("dotenv").config();

module.exports = {
    url: process.env.MONGO_URI_AIRBNB,
    port: process.env.PORT || 8000,
    env: process.env.NODE_ENV || "development"
};