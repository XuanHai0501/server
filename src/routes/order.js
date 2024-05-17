const Router = require("express");
const OrderController = require("../controllers/order");
const { checkLogin, isAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/", OrderController.createOrder);
router.get("/", checkLogin, isAdmin, OrderController.getAllOrder);
router.get("/:id", checkLogin, isAdmin, OrderController.getOrder);
router.put("/:id", checkLogin, isAdmin, OrderController.updateStatus);

module.exports = router;
