const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.use(protect); // All cart routes require authentication

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
// Clear cart route must be last for DELETE /
router.delete("/", clearCart);

module.exports = router;
