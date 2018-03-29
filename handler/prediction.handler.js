const Prediction = require('../models/Prediction.model');
const { getTodaysDate } = require('../helper/helper');

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
  const { predictions } = req.body;
  if (!predictions.dishId) {
    return res.status(400).send({ message: 'Invalid Dishid' });
  }
  return new Prediction(predictions).save((err, document) => {
    if (err) return res.status(500).send({ message: 'Internal Server Error' });
    return res.status(201).send({ message: 'Prediction noted for the day' });
  });
};

// exports.patchPrediction= (req,res){
//     const {dishId} = req.params;

// };
