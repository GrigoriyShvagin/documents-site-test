exports.up = function (knex) {
  return knex.schema.createTable("documents", function (table) {
    table.increments("id").primary();
    table.string("title", 200).notNullable();
    table.text("description");
    table.string("file_path", 500);
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("documents");
};
