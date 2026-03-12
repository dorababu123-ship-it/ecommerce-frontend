const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.post("/", protect, createOrder);

// Named routes must come before :id routes
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/status", protect, admin, updateOrderStatus);

// Admin - get all orders (must be after :id routes)
router.get("/", protect, admin, getOrders);

module.exports = router;
