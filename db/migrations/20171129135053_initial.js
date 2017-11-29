
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project_name').unique();
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {

};
