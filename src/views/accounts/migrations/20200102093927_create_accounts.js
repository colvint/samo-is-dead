exports.up = function(knex) {
  return knex.schema.createTable('accounts', t => {
    t.string('id');
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.string('email').notNullable();
    t.string('gender').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};
