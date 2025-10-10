const amenitiesRouter = require("express").Router();

const { getAmenities } = require("../controllers/amenities");
const { handleInvalidMethods } = require("../errors");

amenitiesRouter.route("/").get(getAmenities).all(handleInvalidMethods);

module.exports = amenitiesRouter;
