const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  dishId: String,
  quantity: String,
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
  },
});
predictionSchema.index({ date: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
