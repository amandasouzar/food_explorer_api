exports.up = knex => knex.schema.createTable('Ingredients_Plates',  table => {
    table.increments('id')
    table.integer('plate_id').references('id').inTable('Plates').onDelete('CASCADE')
    table.integer('ingredient_id').references('id').inTable('Ingredients').onDelete('CASCADE')
 })

exports.down = knex => knex.schema.dropTable('Ingredients_Plates')
