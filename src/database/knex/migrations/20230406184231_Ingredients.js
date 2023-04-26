exports.up = knex => knex.schema.createTable('Ingredients',  table => {
    table.increments('id')
    table.string('name')
 })

exports.down = knex => knex.schema.dropTable('Ingredients')
