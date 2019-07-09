const { getDataConnection } = require("../connections");

const preparePlace = (placeResult) => {
  return placeResult;
};

const getPlacesQuery = (connection) => {
  const query = connection.select({
    address: connection.raw(`row_to_json(parse_address("places"."address"))`),
    rating: "places.rating",
    id: "places.id",
    location: connection.raw(
      `ARRAY[
        ST_X("places"."location"::geometry),
        ST_Y("places"."location"::geometry)
      ]`
    ),
    amenities: connection.select(
      connection.raw('json_agg("amenities"."description")')
    ).from("amenities")
      .innerJoin(
        "place_amenities",
        "place_amenities.amenity_id",
        "=",
        "amenities.id"
      ).where({
        "place_amenities.place_id": connection.column("places.id"),
      }),
  }).from("places");

  return query;
};

const getPlaceQuery = (connection, placeID) => {
  return getPlacesQuery(connection)
    .where({
      "places.id": placeID,
    });
};

module.exports.getPlaces = async () => {
  const connection = await getDataConnection();

  const rows = getPlacesQuery(connection);

  return rows.map(preparePlace);
};

module.exports.getPlace = async ({ placeID }) => {
  const connection = await getDataConnection();

  const [place] = await getPlaceQuery(connection, placeID);

  return preparePlace(place);
};

module.exports.updatePlace = async ({ placeID, ...updates }) => {
  const connection = await getDataConnection();

  await connection.update(
    updates
  ).table("places")
    .where({
      id: placeID,
    });

  return module.exports.getPlace({ placeID });
};
