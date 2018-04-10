const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  kitchenId: String,
  status: {
    type: Boolean,
    default: false, // false represents the Order which hasnt been done
  },
  quantity: Number,
  orderId: String,
  date: {
    type: Date,
    default: Date.now,
  },
  dishId: String,

});
orderSchema.index({ date: -1, kitchenId: 1 });

module.exports = mongoose.model('Order', orderSchema);
