const Dish = require('../models/Dish.model');

exports.getDishes = (req, res) => {
  const { dishId } = req.query;
  if (dishId) {
    return Dish.find({ dishId }).exec((err, document) => {
      if (err) return res.status(500).send({ message: 'Internal Server Error' });
      return res.status(201).send(document);
    });
  }
  return Dish.find().exec((err, document) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    return res.status(201).send(document);
  });
};
exports.postDishes = (req, res) => {
  const { dish } = req.body;
  return new Dish(dish).save((err, document) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    return res.status(201).send({ message: 'Dish added' });
  });
};
