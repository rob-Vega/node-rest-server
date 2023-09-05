const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: { type: String },
  available: { type: Boolean, default: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, status, ...product } = this.toObject();
  return product;
};

module.exports = model("Product", ProductSchema);
