const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishId: String,
  name: String,
  category: {
    type: String,
    enum: ['Veg', 'Nonveg'],
  },
});

module.exports = mongoose.model('Dish', dishSchema);
