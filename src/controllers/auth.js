const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthController = {
  register: async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
      const emailOrPhoneExists = await UserModel.findOne({
        $or: [{ email }, { phone }],
      }).exec();

      if (emailOrPhoneExists) {
        return res.status(400).json({
          message: "Email or phone exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await new UserModel({
        name,
        email,
        phone,
        password: hashedPassword,
      }).save();

      res.json({
        status: true,
        message: "Register successfully",
      });
    } catch (error) {
      res.status(400).json({ message: "Error, please try again", error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // check email registered
      const findUser = await UserModel.findOne({ email }).exec();

      if (!findUser) {
        return res.status(404).json({ message: "Unregistered account!" });
      }

      // check password
      const isPasswordValid = await bcrypt.compare(password, findUser.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Wrong password!" });
      }

      const token = jwt.sign(
        {
          id: findUser._id,
          email: findUser.email,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" },
      );

      res.json({
        user: findUser,
        token,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error, please try again",
        error: error.message,
      });
    }
  },
};

module.exports = AuthController;
