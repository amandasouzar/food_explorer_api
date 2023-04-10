exports.up = knex => knex.schema.createTable('Orders_Plates',  table => {
    table.increments('id')
    table.integer('order_id').references('id').inTable('Orders')
    table.integer('plate_id').references('id').inTable('Plates')
    table.integer('quantity')
    table.float('price')
 })

exports.down = knex => knex.schema.dropTable('Orders_Plates')
