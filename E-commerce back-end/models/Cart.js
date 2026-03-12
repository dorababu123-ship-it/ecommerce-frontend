const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Calculate total price
cartSchema.methods.calculateTotal = function () {
  let total = 0;
  this.items.forEach((item) => {
    total += item.product.price * item.quantity;
  });
  return total;
};

module.exports = mongoose.model("Cart", cartSchema);
