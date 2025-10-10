const amenitiesRouter = require("express").Router();

const { getAmenities } = require("../controllers/amenities");

amenitiesRouter.route("/").get(getAmenities);

module.exports = amenitiesRouter;
