const express = require("express");

const router = new express.Router();

router.use("/rent", require("./rent"));

module.exports = router;