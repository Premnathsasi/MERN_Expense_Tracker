const Razorpay = require("razorpay");
const Order = require("../models/orders");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      const neworder = new Order({
        orderId: order.id,
        status: "PENDING",
        userId: req.user,
      });
      neworder
        .save()
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Something went wrong", error: err });
  }
};

exports.updateStatus = async (req, res, next) => {
  const { payment_id, order_id } = req.body;
  try {
    const data = await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentId: payment_id, status: "SUCCESSFUL" }
    );
    if (data) {
      await req.user.updateOne({ isPremiumUser: true }).then((data) => {
        return res.status(202).json({
          success: true,
          message: "Transaction Successful",
          data: data,
        });
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};
