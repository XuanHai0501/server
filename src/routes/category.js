const Router = require("express");
const CategoryController = require("../controllers/category");
const { checkLogin, isAdmin } = require("../middlewares/auth");

const router = Router();

router.post("/", checkLogin, isAdmin, CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.get("/:slug", CategoryController.getCategory);
router.put("/:id", checkLogin, isAdmin, CategoryController.updateCategory);
router.delete("/:id", checkLogin, isAdmin, CategoryController.deleteCategory);

module.exports = router;
