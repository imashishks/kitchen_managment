const Dish = require('../models/Dish.model');
const Order = require('../models/Order.model');
const Prediction = require('../models/Prediction.model');
const { getTodaysDate } = require('../helper/helper');

exports.getReport = async (req, res) => {
  const { start, end } = getTodaysDate();
  try {
    const dishes = await Dish.find().exec();
    const report = dishes.map(async (dish) => {
      try {
        const orders = await Order
          .find({ dishId: dish.dishId, status: true, date: { $lt: end, $gt: start } })
          .exec();
        const prediction = await Prediction
          .findOne({ dishId: dish.dishId, date: { $lt: end, $gt: start } })
          .select('quantity')
          .exec();

        const created = orders.reduce((prevVal, currVal) => prevVal + (currVal.quantity || 0), 0);

        return {
          dishName: dish.name,
          produced: created,
          predictions: prediction.quantity,
        };
      } catch (e) {
        return {};
      }
    });
    return res.status(200).send(report);
  } catch (e) {
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};
