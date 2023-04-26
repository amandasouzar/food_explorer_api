exports.up = knex => knex.schema.createTable('Users',  table => {
    table.increments('id')
    table.string('email')
    table.string('password')
    table.string('name')
    table.boolean('isAdmin')
    table.timestamp('created_at').defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable('Users')