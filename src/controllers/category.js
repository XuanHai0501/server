const slugify = require("slugify");
const CategoryModel = require("../models/category");
const ProductModel = require("../models/products");

const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const { name, image, parentId, isShowHome } = req.body;
      const slug = slugify(name, {
        locale: "vi",
        lower: true,
      });

      const category = await new CategoryModel({
        name,
        slug,
        image,
        parentId,
        isShowHome,
      }).save();

      res.json(category);
    } catch (error) {
      res.status(400).json({
        message: "Error, please try again",
        error: error.message,
      });
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const { isShowHome, type } = req.query;

      if (isShowHome == "true") {
        const categories = await CategoryModel.find({ isShowHome: true }).exec();
        const categoriesIncludeProd = [];
        for await (item of categories) {
          const products = await ProductModel.find({ category: item._id }).exec();

          categoriesIncludeProd.push({
            ...item.toJSON(),
            products,
          });
        }

        return res.json(categoriesIncludeProd);
      }

      const queryObj = {
        parentId: null,
      };
      if (type === "ALL") {
        delete queryObj.parentId;
      } else if (type === "SUB_CATEGORY") {
        queryObj.parentId = {
          $ne: null,
        };
      }

      const categories = await CategoryModel.find(queryObj).populate("parentId").exec();

      const categoryIncludeSubCategory = [];
      for await (item of categories) {
        const subCategories = await CategoryModel.find({ parentId: item._id }).exec();

        categoryIncludeSubCategory.push({
          ...item.toJSON(),
          subCategories,
        });
      }

      res.json(categoryIncludeSubCategory);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  getCategory: async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.findOne({ slug }).exec();

      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
      }

      const isSubCategory = category.parentId !== null;

      if (isSubCategory) {
        const products = await ProductModel.find({ category: category._id }).exec();

        return res.json({
          category,
          products,
        });
      }

      const subCategories = await CategoryModel.find({ parentId: category._id }).exec();
      const subCateIncludeProd = [];
      for await (item of subCategories) {
        const products = await ProductModel.find({ category: item._id }).exec();

        subCateIncludeProd.push({
          ...item.toJSON(),
          products,
        });
      }

      res.json({ category, subCategories: subCateIncludeProd });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name, ...data } = req.body;
      const { id } = req.params;

      const slug = slugify(name, {
        locale: "vi",
        lower: true,
      });

      const categoryUpdated = await CategoryModel.findByIdAndUpdate(id, { ...data, name, slug }, { new: true }).exec();

      res.json(categoryUpdated);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findByIdAndDelete(id).exec();

      const isParentCategory = category.parentId === null;
      if (isParentCategory) {
        await CategoryModel.deleteMany({ parentId: category._id }).exec();
      }

      res.json(category);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
};

module.exports = CategoryController;
