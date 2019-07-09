const express = require("express");

const router = new express.Router();

router.use("/users", require("./users"));

router.use("/places", require("./places"));

module.exports = router;
