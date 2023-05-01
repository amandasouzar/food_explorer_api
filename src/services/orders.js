const knex = require("../database/knex");

class OrdersServices {
  async create(client_id, admin_id, plates) {
    try {
      const verifyClientId = await knex("Users").where({
        id: +client_id,
        isAdmin: "false",
      });
      const verifyAdminId = await knex("Users").where({
        id: +admin_id,
        isAdmin: "true",
      });

      if (verifyClientId.length === 0) {
        return { message: "Verifique o ID do cliente.", status: 400 };
      }

      if (verifyAdminId.length === 0) {
        return { message: "Verifique o ID do admin.", status: 400 };
      }

      const order_id = +(await knex("Orders").insert({
        client_id,
        admin_id,
        status: "CREATED",
      }));

      for await (const element of plates) {
        const choosenPlate = await knex("Plates")
          .where({ id: element.plate_id })
          .first();

        if (!choosenPlate) {
          await knex("Orders").where({ id: order_id }).delete();
          return { message: "Prato não cadastrado.", status: 400 };
        }

        await knex("Orders_Plates").insert({
          order_id,
          plate_id: element.plate_id,
          quantity: element.quantity,
          price: choosenPlate.price,
        });
      }

      const plates_info = await knex
        .select("quantity", "price")
        .from("Orders_Plates")
        .where({ order_id });

      let totalPrice = 0;

      for (const infos of plates_info) {
        const priceForPlate = infos.quantity * infos.price;
        totalPrice = totalPrice + priceForPlate;
      }

      await knex("Orders").where({ id: order_id }).update({ totalPrice });

      return { message: "Pedido criado.", status: 200 };
    } catch (err) {
      return err;
    }
  }

  async update(order_id, operation_id, plates) {
    try {
      const verifyOrder = await knex("Orders").where({ id: +order_id });

      if (verifyOrder.length === 0) {
        return { message: "Pedido não existe.", status: 400 };
      }

      for await (const element of plates) {
        const choosenPlate = await knex("Plates")
          .where({ id: element.plate_id })
          .first();

        if (!choosenPlate) {
          await knex("Orders").where({ id: order_id }).delete();
          return { message: "Prato não cadastrado.", status: 400 };
        }

        const plateExistsInOrder = await knex("Orders_Plates")
          .where({ order_id, plate_id: element.plate_id })
          .first();

        if (!plateExistsInOrder) {
          await knex("Orders_Plates").insert({
            order_id,
            plate_id: element.plate_id,
            quantity: element.quantity,
            price: choosenPlate.price,
          });
        } else {
          if (operation_id == 0) {
            await knex("Orders_Plates")
              .where({ id: plateExistsInOrder.id })
              .first()
              .update({
                quantity: plateExistsInOrder.quantity + element.quantity,
              });
          }
          if (operation_id == 1) {
            const plate = await knex("Orders_Plates")
              .where({ id: plateExistsInOrder.id })
              .first();
            if (plate.quantity == 0) {
              await knex("Orders_Plates")
                .where({ id: plateExistsInOrder.id })
                .first()
                .update({
                  quantity: plateExistsInOrder.quantity - element.quantity,
                });
            } else {
              await knex("Orders_Plates")
                .where({ id: plateExistsInOrder.id })
                .first()
                .delete();
            }
          }
        }
      }

      const plates_info = await knex
        .select("quantity", "price")
        .from("Orders_Plates")
        .where({ order_id });

      let totalPrice = 0;

      for (const infos of plates_info) {
        const priceForPlate = infos.quantity * infos.price;
        totalPrice = totalPrice + priceForPlate;
      }

      await knex("Orders")
        .where({ id: order_id })
        .update({ totalPrice, status: "UPDATED" });

      return { message: "Pedido atualizado.", status: 200 };
    } catch (err) {
      return err;
    }
  }

  async GetByAdminId(admin_id) {

    try {
      const verifyAdminId = await knex("Users").where({
        id: +admin_id,
        isAdmin: "true",
      });

      if (verifyAdminId.length === 0) {
        return { message: "Verifique o ID do admin.", status: 400 };
      }

      const ordersFromAdmin = await knex
        .select("*")
        .from("Orders")
        .where({ admin_id})

        if (ordersFromAdmin.length == 0) {
          return { message: 'Não há pedidos associados.', status: 400 };
        }

        return { message: ordersFromAdmin, status: 400 }; 
    } catch (err) {
      return err
    }
  }

  async GetByClientId(client_id) {
    try {
      const verifyClientId = await knex("Users").where({
        id: +client_id,
        isAdmin: "false",
      });
  
      if (verifyClientId.length === 0) {
        return { message: "Verifique o ID do cliente.", status: 400 };
      }
      const ordersFromClient = await knex
        .select("*")
        .from("Orders")
        .where({ client_id})

      if (ordersFromClient.length == 0) {
        return { message: 'Não há pedidos associados.', status: 400 };
      }

        return { message: ordersFromClient, status: 400 };
    } catch (err) {
      return err
    }
  }

  async delete (order_id) {
    try {
      const verifyOrder = await knex("Orders").where({ id: +order_id });
  
      if (verifyOrder.length === 0) {
        return { message: "Pedido não existe.", status: 400 };
      }

      await knex('Orders').where({id: order_id}).delete()

      return { message: "Pedido deletado.", status: 400 }; 
    } catch (err) {
      return err
    }
  }
}

module.exports = OrdersServices;
