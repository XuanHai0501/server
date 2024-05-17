const Router = require("express");
const ProductController = require("../controllers/product");
const { checkLogin, isAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/", checkLogin, isAdmin, ProductController.createProduct);
router.get("/", ProductController.getAllProduct);
router.get("/:slug/related", ProductController.getProductRelated);
router.get("/:slug", ProductController.getProduct);
router.put("/:id", checkLogin, isAdmin, ProductController.updateProduct);
router.delete("/:id", checkLogin, isAdmin, ProductController.deleteProduct);

module.exports = router;
