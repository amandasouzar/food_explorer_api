const OrdersServices = require('../services/orders')
const ordersServices = new OrdersServices()

class OrdersController {
  async create(req, res) {
    const { client_id, admin_id } = req.params;

    const { plates } = req.body;

    try {
      const returnedValues = await ordersServices.create(client_id, admin_id, plates)
  
      return res.json({message: returnedValues.message, status: returnedValues.status})

    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
  }}

  async update(req, res) {
    const {operation_id , order_id} = req.params;

    const { plates } = req.body;

    try {
     
      const returnedValues = await ordersServices.update(order_id,operation_id, plates)
      console.log(returnedValues)

      return res.json({message: returnedValues.message, status: returnedValues.status});
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }
  }}

  async GetByAdminId(req, res) {
    const { admin_id } = req.params;

    try {
      const returnedValues = await ordersServices.GetByAdminId(admin_id)

      return res.json({message: returnedValues.message, status: returnedValues.status});
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }}}

  async GetByClientId(req, res) {
    const { client_id } = req.params;

    try {
      const returnedValues = await ordersServices.GetByClientId(client_id)

      return res.json({message: returnedValues.message, status: returnedValues.status});
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }}}

  async delete (req, res) {
    const {order_id} = req.params

    try {
      const returnedValues = await ordersServices.delete(order_id)

      return res.json({message: returnedValues.message, status: returnedValues.status})
    } catch (err) {
      if (err.code === "ER_DBACCESS_DENIED_ERROR") {
        res.status(401).json({ error: "Acesso não autorizado." });
      } else {
        res.status(500).json({ error: "Erro interno do servidor." });
      }}}
  }

module.exports = OrdersController;
