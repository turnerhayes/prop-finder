const amenitiesTableName = "amenities";
const placesAmenitiesMappingTableName = "place_amenities";
const placesTableName = "places";

exports.up = async function(knex, Promise) {
  await knex.schema.createTable(amenitiesTableName, (table) => {
    table.increments("id").notNullable();
    table.text("description");
    table.timestamps(true, true);
    table.timestamp("deleted_at");
  });

  await knex.schema.createTable(placesTableName, (table) => {
    table.increments("id").notNullable();
    table.text("address").notNullable();
    table.specificType("location", "geography(POINT)");
    table.specificType("rating", "char");
    table.timestamps(true, true);
    table.timestamp("deleted_at");
    knex.schema.raw(
      `ALTER TABLE ${placesTableName} CHECK "rating" BETWEEN 1 AND 5`
    );
  });

  return knex.schema.createTable(placesAmenitiesMappingTableName, (table) => {
    table.integer("place_id");
    table.integer("amenity_id");
    table.foreign("place_id").references("id").inTable(placesTableName)
      .onDelete("CASCADE");
    table.foreign("amenity_id").references("id").inTable(amenitiesTableName)
      .onDelete("CASCADE");
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists(placesAmenitiesMappingTableName);
  await knex.schema.dropTableIfExists(amenitiesTableName);
  return knex.schema.dropTableIfExists(placesTableName);
};
