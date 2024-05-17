const { default: slugify } = require("slugify");
const ProductModel = require("../models/products");

const ProductController = {
  createProduct: async (req, res) => {
    try {
      const { name, image, price, description, quantity, category } = req.body;
      const slug = slugify(name, {
        locale: "vi",
        lower: true,
      });

      const product = await new ProductModel({
        name,
        image,
        price,
        description,
        slug,
        quantity,
        category,
      }).save();

      res.json(product);
    } catch (error) {
      res.status(400).json({
        message: "Error, please try again",
        error: error.message,
      });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const { search } = req.query;
      const queryObj = {};
      if (search) {
        const nameRegex = new RegExp(search, "i");
        queryObj.name = {
          $regex: nameRegex,
        };
      }

      const products = await ProductModel.find(queryObj).populate("category").exec();

      res.json(products);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  getProductRelated: async (req, res) => {
    try {
      const { slug } = req.params;
      const foundProduct = await ProductModel.findOne({ slug }).exec();

      if (!foundProduct) {
        return res.status(404).json({
          message: "Product not found!",
        });
      }

      const productsRelated = await ProductModel.find({
        $and: [
          {
            _id: { $ne: foundProduct._id },
          },
          {
            category: foundProduct.category,
          },
        ],
      }).exec();

      res.json(productsRelated);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  getProduct: async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await ProductModel.findOneAndUpdate({ slug }, { $inc: { view: 1 } }, { new: true })
        .populate("category")
        .exec();

      if (!product) {
        return res.status(404).json({ message: "Product not found!" });
      }

      res.json(product);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name, ...data } = req.body;
      const { id } = req.params;

      const slug = slugify(name, {
        locale: "vi",
        lower: true,
      });

      const product = await ProductModel.findByIdAndUpdate(id, { ...data, name, slug }, { new: true }).exec();

      res.json(product);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await ProductModel.findByIdAndDelete(id).exec();

      res.json(product);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
};

module.exports = ProductController;
