
const Dish = require('../models/Dish.model');
const Order = require('../models/Order.model');
const Prediction = require('../models/Prediction.model');
const { getTodaysDate } = require('../helper/helper');

exports.getReport = async (req, res) => {
  const { start, end } = getTodaysDate();

  try {
    const dishes = await Dish
      .find()
      .lean()
      .exec();
    const dishIds = dishes.map(dish => dish.dishId);

    const orders = await Order
      .find({ dishId: { $in: dishIds }, status: true, date: { $lt: end, $gt: start } })
      .lean()
      .exec();
    // hashMap for orders
    const orderHash = orders.reduce((iVal, order) => {
      const temp = Object.assign({}, iVal);
      if (!order.status) return temp;
      temp[order.dishId] = (temp[order.dishId] || 0) + order.quantity;
      return temp;
    }, {});
    const prediction = await Prediction
      .find({ dishId: { $in: dishIds }, date: { $lt: end, $gt: start } })
      .select('quantity dishId')
      .lean()
      .exec();

    // hashMap for predictions
    const predictionHash = prediction.reduce((i, pred) => {
      const temp = Object.assign({}, i);
      temp[pred.dishId] = pred.quantity;
      return temp;
    }, {});
    // Final List
    const finalList = dishes.reduce((i, dish) => {
      const temp = [...i];
      temp.push({
        name: dish.name,
        produced: orderHash[dish.dishId] || 0,
        predicted: predictionHash[dish.dishId] || 0,
      });
      return temp;
    }, []);

    return res.status(200).send(finalList);
  } catch (e) {
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};
