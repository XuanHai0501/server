const ProductModel = require("../models/products");
const { STATUS_ORDER, OrderModel } = require("../models/orders");

const OrderController = {
  createOrder: async (req, res) => {
    try {
      const { customerName, customerPhone, customerEmail, address, message, orderBy, products } = req.body;

      const productsOrder = [];
      for await (item of products) {
        const product = await ProductModel.findById(item.productId).exec();

        const newQuantity = product.quantity - item.quantity;
        if (newQuantity < 0) {
          return res.status(400).json({ message: "The quantity specified exceeds maximum quantity allowed" });
        } else {
          await product.updateOne({ $inc: { sold: item.quantity, quantity: -item.quantity } }).exec();

          productsOrder.push({
            quantity: item.quantity,
            product,
          });
        }
      }

      const totalPrice = productsOrder.reduce((total, item) => {
        const totalPrice = item.quantity * item.product.price;

        total += totalPrice;

        return total;
      }, 0);

      const order = await new OrderModel({
        customerName,
        customerEmail,
        customerPhone,
        address,
        message,
        orderBy,
        totalPrice,
        products: productsOrder,
      }).save();

      res.json(order);
    } catch (error) {
      res.status(400).json({
        message: "Error, please try again",
        error: error.message,
      });
    }
  },

  getAllOrder: async (req, res) => {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).exec();

      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await OrderModel.findById(id).exec();

      if (!order) {
        return res.status(404).json({ message: "Order not found!" });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!STATUS_ORDER.includes(status)) {
        return res.status(400).json({ message: "Status is not valid" });
      }

      const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = OrderController;
