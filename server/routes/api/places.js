const express = require("express");

const {
  getPlaces,
  getPlace,
  updatePlace,
} = require("../../persistence/stores/places");

const router = new express.Router();

router.route("/")
  .get(
    async (req, res, next) => {
      try {
        const places = await getPlaces();

        res.json(places);
      } catch (ex) {
        next(ex);
      }
    }
  );

router.route("/:placeID")
  .get(
    async (req, res, next) => {
      const placeID = Number(req.params.placeID);

      try {
        const place = await getPlace({ placeID });

        res.json(place);
      } catch (ex) {
        next(ex);
      }
    }
  )
  .patch(
    express.json(),
    async (req, res, next) => {
      const placeID = Number(req.params.placeID);
      const updates = req.body;

      try {
        const place = await updatePlace({
          placeID,
          ...updates,
        });

        res.json(place);
      } catch (ex) {
        next(ex);
      }
    }
  );

module.exports = router;
