import Order from "../models/orderModel.js";

// create order 

export const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      paymentMethod,
      totalAmount,
      buyer,
      product,
      deliveryCharges,
      discount,
      status,
      orderDate,
    } = req.body;

    // Simple validation
    if (!buyer || !product) {
      return res.status(400).json({ message: "Buyer and Product details are required" });
    }

    const order = new Order({
      orderNumber,
      paymentMethod,
      totalAmount,
      buyer,
      product,
      deliveryCharges,
      discount,
      status,
      orderDate: orderDate || Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//    GET /api/orders
export const getOrders = async (req, res) => {
  try {
    // Pagination Logic
    const pageSize = Number(req.query.pageSize) || 10; // Default 10 items per page
    const page = Number(req.query.pageNumber) || 1;

    // If you want to add search on backend later, you can add a keyword filter here.
    // For now, we get all counts.
    const count = await Order.countDocuments({});

    const orders = await Order.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      totalOrders: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//    Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: "Order not found" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};