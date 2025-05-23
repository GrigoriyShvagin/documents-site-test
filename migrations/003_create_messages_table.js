exports.up = function (knex) {
  return knex.schema.createTable("messages", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("subject", 200).notNullable();
    table.text("message").notNullable();
    table.enu("status", ["new", "in_progress", "resolved"]).defaultTo("new");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
