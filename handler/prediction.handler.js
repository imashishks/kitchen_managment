const Prediction = require('../models/Prediction.model');
const { getTodaysDate } = require('../helper/helper');
/*  eslint-disable */
exports.getPrediction = (req, res) => {
  const { start, end } = getTodaysDate();

  Prediction.find({
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
exports.postPrediction = (req, res) => {
  const prediction = req.body;
  const { start, end } = getTodaysDate();
  if (!prediction.dishId) {
    return res.status(400).send({ message: 'Invalid Dishid' });
  }
  return Prediction
    .findOneAndUpdate({ dishId: prediction.dishId, date: { $lt: end, $gt: start } }, prediction, { upsert: true, setDefaultsOnInsert: true }, (err, document) => {
      if (err) return res.status(500).send({ message: 'Internal Server Error' });
      return res.status(201).send({ message: 'Prediction noted for the day' });
    });
};

// exec `npm start &`
