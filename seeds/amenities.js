const tableName = "amenities";

exports.seed = function(knex, Promise) {
  return knex.raw(`TRUNCATE TABLE ${tableName} CASCADE`)
    .then(() => {
      return knex(tableName).insert([
        {
          description: "Pool",
        },
        {
          description: "Sauna",
        },
        {
          description: "Hot tub",
        },
      ]);
    });
};
