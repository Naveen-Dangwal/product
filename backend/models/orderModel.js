import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    // Top Section: Order Details
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true, // e.g., 78369274
    },
    paymentMethod: {
      type: String,
      required: true, // e.g., "cod"
    },
    totalAmount: {
      type: Number,
      required: true, // e.g., 799
    },

    // Top Section: Buyer Details
    buyer: {
      name: { type: String, required: true },
      state: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Bottom Section: Product Details
    product: {
      name: { type: String, required: true }, // Blue Vivo Mobile Phone
      model: { type: String, required: true }, // Y11
      price: { type: Number, required: true }, // 799
      image: { type: String, required: false }, // URL to image
      quantity: { type: Number, required: true, default: 1 },
    },

    // Bottom Section: Delivery & Status
    deliveryCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "fulfilled", "shipped", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;