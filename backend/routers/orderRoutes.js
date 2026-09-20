import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/orderController.js";

const router = express.Router();


router.route("/").post(createOrder).get(getOrders);
router.route("/:id").get(getOrderById);

export default router;