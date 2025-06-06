/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("documents", function (table) {
    table.string("file_name", 255);
    table.integer("file_size");
    table.string("file_type", 100);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("documents", function (table) {
    table.dropColumn("file_name");
    table.dropColumn("file_size");
    table.dropColumn("file_type");
  });
};
