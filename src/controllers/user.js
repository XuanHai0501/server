const UserModel = require("../models/users");

const UserController = {
  getProfile: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.user.email }).exec();

      if (!user) {
        return res.json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({
        message: "Error, please try again",
        error: error.message,
      });
    }
  },
};

module.exports = UserController;
