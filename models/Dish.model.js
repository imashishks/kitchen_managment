const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishId: { type: [String], index: true },
  name: String,
  category: {
    type: String,
    enum: ['Veg', 'Nonveg'],
  },
  imgUrl: String,
});

module.exports = mongoose.model('Dish', dishSchema);
