exports.up = knex => knex.schema.createTable('Favorites',  table => {
    table.increments('id')
    table.integer('client_id').references('id').inTable('Users').onDelete('CASCADE')
    table.integer('plate_id').references('id').inTable('Plates').onDelete('CASCADE')
    table.boolean('isFavorite')
})

exports.down = knex => knex.schema.dropTable('Favorites')
