const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// router
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// connect db
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connect db successfully");
  })
  .catch((error) => {
    console.log("Connect failed", error);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server is running on port", PORT));
