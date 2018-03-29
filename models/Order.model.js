const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  kitchenId: String,
  status: {
    type: Boolean,
    default: false, // false represents the Order which hasnt been done
  },
  dishId: String,
  quantity: Number,
  orderId: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
