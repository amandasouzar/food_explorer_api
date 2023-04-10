exports.up = knex => knex.schema.createTable('Plates',  table => {
    table.increments('id')
    table.integer('admin_id').references('id').inTable('Admins').onDelete('CASCADE')
    table.string('name')
    table.integer('category_id').references('id').inTable('Categories')
    table.string('description')
    table.string('image')
    table.float('price')
    table.integer('ingredient_id').references('id').inTable('Ingredients')
    table.boolean('isFavorite')
 })

exports.down = knex => knex.schema.dropTable('Plates')
