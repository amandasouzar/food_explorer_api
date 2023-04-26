const knex = require("../database/knex");

class OrdersController {
  async create(req, res) {
    const { client_id, admin_id } = req.params;

    const { plates } = req.body;

    try {
      const order_id = +(await knex("Orders").insert({
        client_id,
        admin_id,
        status: "CREATED",
      }));

      for await (const element of plates) {
        const choosenPlate = await knex("Plates")
          .where({ id: element.plate_id })
          .first();

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

      return res.json("Pedido criado!");
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }

  async updateForAdding(req, res) {
    const { order_id } = req.params;

    const { plates } = req.body;

    try {
      for await (const element of plates) {
        const choosenPlate = await knex("Plates")
          .where({ id: element.plate_id })
          .first();

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
          await knex("Orders_Plates")
            .where({ id: plateExistsInOrder.id })
            .first()
            .update({
              quantity: plateExistsInOrder.quantity + element.quantity,
            });
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

      return res.json("Pedido atualizado, itens adicionados!");
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }

  async updateForRemoving(req, res) {
    const { order_id } = req.params;

    const { plates } = req.body;

    try {
      for await (const element of plates) {
        const plateExistsInOrder = await knex("Orders_Plates")
          .where({ order_id, plate_id: element.plate_id })
          .first();

        await knex("Orders_Plates")
          .where({ id: plateExistsInOrder.id })
          .first()
          .update({ quantity: plateExistsInOrder.quantity - element.quantity });
      }

      const plates_info = await knex
        .select("quantity", "price", "plate_id")
        .from("Orders_Plates")
        .where({ order_id });

      let totalPrice = 0;

      for (const infos of plates_info) {
        if (infos.quantity === 0) {
          await knex("Orders_Plates")
            .where({ order_id, plate_id: infos.plate_id })
            .delete();
        }

        const priceForPlate = infos.quantity * infos.price;
        console.log({ priceForPlate });
        totalPrice = priceForPlate + totalPrice;
        console.log({ totalPrice });
      }

      await knex("Orders")
        .where({ id: order_id })
        .update({ totalPrice, status: "UPDATED" });

      return res.json("Pedido atualizado, itens removidos!");
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }

  async GetByAdminId(req, res) {
    const { admin_id } = req.params;

    try {
      const ordersFromAdmin = await knex
        .select("*")
        .from("Orders")
        .where({ admin_id})

      return res.json(
        ordersFromAdmin
      );
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }

  async GetByClientId(req, res) {
    const { client_id } = req.params;

    try {
      const ordersFromClient = await knex
        .select("*")
        .from("Orders")
        .where({ client_id})

      return res.json(
        ordersFromClient
      );
    } catch (err) {
      return res.json({ message: err, status: 500 });
    }
  }
}

module.exports = OrdersController;
