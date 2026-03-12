const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      items: cart.items,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image"
    );

    const total = populatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      items: populatedCart.items,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image"
    );

    const total = populatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      items: populatedCart.items,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image"
    );

    const total = populatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      items: populatedCart.items,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      items: [],
      total: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
