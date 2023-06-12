const OrdersServices = require("../services/orders");
const ordersServices = new OrdersServices();

class OrdersController {
  async create(req, res) {
    const { admin_id } = req.params;
    const { user: client } = req;

    const { plates } = req.body;

    try {
      const returnedValues = await ordersServices.create(
        client[0].id,
        admin_id,
        plates
      );

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async update(req, res) {
    const { operation_id, order_id } = req.params;

    const { plates } = req.body;

    try {
      const returnedValues = await ordersServices.update(
        order_id,
        operation_id,
        plates
      );

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async deleteItem(req, res) {
    const { order_id, plate_id } = req.params;

    try {
      const returnedValues = await ordersServices.deleteItem(
        order_id,
        plate_id
      );

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
        newPrice: returnedValues.newPrice
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async GetByAdminId(req, res) {
    const { user: admin } = req;

    try {
      const returnedValues = await ordersServices.GetByAdminId(admin[0].id);

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async GetByClientId(req, res) {
    const { user: client } = req;

    try {
      const returnedValues = await ordersServices.GetByClientId(client[0].id);

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async getHistory(req, res) {
    const { user: client } = req;

    try {
      const returnedValues = await ordersServices.getHistory(client[0].id);

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }

  async close(req, res) {
    const { order_id } = req.params;

    try {
      const returnedValues = await ordersServices.close(order_id);

      return res.json({
        message: returnedValues.message,
        status: returnedValues.status,
      });
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
    }
  }
}

module.exports = OrdersController;
