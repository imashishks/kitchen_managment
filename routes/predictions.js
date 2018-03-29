const express = require('express');

const router = express.Router();

const { getPrediction, postPrediction } = require('../handler/prediction.handler');

router.route('/')
  .get(getPrediction)
  .post(postPrediction);


module.exports = router;
