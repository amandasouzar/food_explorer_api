exports.up = knex => knex.schema.createTable('Ingredients_Plates',  table => {
    table.increments('id')
    table.integer('plate_id').references('id').inTable('Plates')
    table.integer('ingredient_id').references('id').inTable('Ingredients')
    table.float('weigth_in_g')
 })

exports.down = knex => knex.schema.dropTable('Ingredients_Plates')
