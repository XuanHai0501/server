const Router = require("express");
const UserController = require("../controllers/user");
const { checkLogin } = require("../middlewares/auth");

const router = Router();

router.get("/profile", checkLogin, UserController.getProfile);

module.exports = router;
