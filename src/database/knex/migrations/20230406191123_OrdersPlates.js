exports.up = knex => knex.schema.createTable('Orders_Plates',  table => {
    table.increments('id')
    table.integer('order_id').references('id').inTable('Orders').onDelete('CASCADE')
    table.integer('plate_id').references('id').inTable('Plates').onDelete('CASCADE')
    table.integer('quantity')
    table.float('price')
 })

exports.down = knex => knex.schema.dropTable('Orders_Plates')
