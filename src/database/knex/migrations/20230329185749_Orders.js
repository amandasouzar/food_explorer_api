exports.up = knex => knex.schema.createTable('Orders',  table => {
    table.increments('id')
    table.integer('admin_id').references('id').inTable('Users').onDelete('CASCADE')
    table.integer('client_id').references('id').inTable('Users').onDelete('CASCADE')
    table.string('status')
    table.float('totalPrice')
    table.date('created_at').defaultTo(knex.fn.now())
 })

exports.down = knex => knex.schema.dropTable('Orders')
