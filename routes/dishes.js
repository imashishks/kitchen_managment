const express = require('express');
const { getDishes, postDishes } = require('../handler/dish.handler');

const router = express.Router();

router.route('/')
  .get(getDishes)
  .post(postDishes);

module.exports = router;
