exports.up = knex => knex.schema.createTable('Categories',  table => {
    table.increments('id')
    table.string('name')
 })

exports.down = knex => knex.schema.dropTable('Categories')