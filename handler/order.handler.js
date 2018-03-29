const Order = require('../models/Order.model');
const { getTodaysDate } = require('../helper/helper');

exports.getOrder = (req, res) => {
  const { status } = req.query;
  const { start, end } = getTodaysDate();

  Order.find({
    status: !!status,
    date: {
      $lt: end,
      $gt: start,
    },

  }).exec((err, orders) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(200).send(orders);
  });
};
exports.postOrder = (req, res) => {
  const { dishes } = req.body;
  // To check if there are dishes
  if (!dishes.length) {
    return res.status(400).send({ message: 'Bad Request' });
  }
  const flag = dishes.every((dish) => {
    if (!parseInt(dish.quantity, 10)) {
      return false;
    }
    return true;
  });
  if (!flag) {
    return res.status(400).send({ message: 'Invalid Quantity' });
  }

  const orderId = `O${new Date().getTime()}`;
  const promises = dishes.map(dish => new Order({
    kitchenId: `K${new Date().getTime()}`,
    orderId,
    dishId: dish.dishId,
    quantity: dish.quantity,
  }).save());

  return Promise.all(promises).then(data => res.status(201).send({ message: 'Order Placed' })).catch(error => res.status(500).send({ message: 'Internal Server Error' }));
};

exports.patchOrder = (req, res) => {
  const { kitchenId } = req.params;
  const patch = req.body;
  if (!Object.keys(patch).length) {
    return res.status(400).send({ message: 'Bad Request' });
  }
  return Order.findOneAndUpdate({ kitchenId }, patch, { new: true }).exec((err, document) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(200).send({ message: 'Updated Successfully', document });
  });
};

exports.getDishCreationCount = (req, res) => {
  const { dishId } = req.params;
  const { start, end } = getTodaysDate();
  // Order.count({ dishId, date: { $lt: end, $gt: start } }).exec((err, count) => {
  //   if (err) {
  //     return res.status(500).send({ message: 'Internal Server Error' });
  //   }
  //   return res.status(200).send({ message: 'Success', count });
  // });


  Order.aggregate([
    { $match: { dishId, date: { $lt: end, $gt: start } } },
    {
      $group: {
        _id: null,
        total: { $sum: '$quantity' },
      },
    },
  ], (err, doc) => {
    console.log(err, doc);
  });
  return res.status(200).send();
};

