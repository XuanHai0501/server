const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      default: null,
    },
    isShowHome: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = model("categories", categorySchema);
