const Order = require('../models/Order.model');
const Dish = require('../models/Dish.model');
const Prediction = require('../models/Prediction.model');
const { getTodaysDate } = require('../helper/helper');
const uuidv4 = require('uuid/v4');


/* eslint-disable */

exports.getOrder = async (req, res) => {
  const { start, end } = getTodaysDate();
  kitchenDisplay((err, pendingDishes) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(200).send(pendingDishes);
  });
  // });
};
exports.postOrder = (req, res) => {
  const dishes = req.body;

  // io = require('../bin/www').io

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
    kitchenId: `K${uuidv4()}`,
    orderId,
    quantity: dish.quantity,
    dishId: dish.dishId,
  }).save());


  Promise.all(promises).then(data => {
    kitchenDisplay((err, data1) => {
      global.io.sockets.emit("updateDisplay", data1)
    })

    res.status(201).send({ message: 'Order Placed' })
  }).catch(error => res.status(500).send({ message: 'Internal Server Error', error }));
};

exports.patchOrder = (req, res) => {
  const { kitchenId } = req.params;
  const patch = req.body;
  console.log(patch, kitchenId);
  patchOrder(kitchenId, patch, (err, document) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(200).send({ message: 'Updated Successfully', document });
  });
};

function updateOrder(kid, patch, cb) {
  if (!Object.keys(patch).length) {
    return cb('Bad Request');
  }
  return Order.findOneAndUpdate({ kitchenId: kid }, patch, { new: true }).exec((err, document) => {
    if (err) {
      // return res.status(500).send({ message: 'Internal Server Error' });
      return cb(err);
    }
    return cb(null, document);
    // return res.status(200).send({ message: 'Updated Successfully', document });
  });
}
exports.updateOrder = updateOrder


const kitchenDisplay = (cb) => {
  const { start, end } = getTodaysDate();
  Order.find({
    date: {
      $lt: end,
      $gt: start,
    },
  }).lean().exec(async (err, orders) => {
    if (err) {
      return cb(err);
    }
    const dishIds = orders.map(order => order.dishId);
    const dishes = await Dish.find({ dishId: { $in: dishIds } }).select('name dishId').lean().exec();
    const predictions = await Prediction.find({
      dishId: { $in: dishIds },
      date: {
        $lt: end,
        $gt: start,
      },
    }).lean().exec();

    const produced = orders.reduce((inital, order) => {
      const tmp = Object.assign({}, inital);
      if (!order.status) return tmp;
      tmp[order.dishId] = (tmp[order.dishId] || 0) + order.quantity;
      return tmp;
    }, {});

    const dishNames = dishes.reduce((inital, dish) => {
      const tmp = Object.assign({}, inital);

      tmp[dish.dishId] = dish.name;
      return tmp;
    }, {});


    const predMap = predictions.reduce((inital, pred) => {
      const tmp = Object.assign({}, inital);
      tmp[pred.dishId] = pred.quantity;
      return tmp;
    }, {});

    const pendingDishes = orders.reduce((initial, order) => {
      const tmp = [...initial];
      if (!order.status) {
        tmp.push({
          name: dishNames[order.dishId],
          prepared: produced[order.dishId] || 0,
          quantity: order.quantity,
          predicted: predMap[order.dishId] || 0,
          dishId: order.dishId,
          kitchenId: order.kitchenId,
          orderId: order.orderId,
        });
      }
      return tmp;
    }, []);
    return cb(null, pendingDishes);
  });
};

exports.kitchenDisplay = kitchenDisplay;
