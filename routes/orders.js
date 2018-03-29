const express = require('express');
const {
  getOrder, getDishCreationCount, postOrder, patchOrder,
} = require('../handler/order.handler');

const router = express.Router();
// All authentications will be done inside Middleware
// TODO: Create Auth Middleware
router.route('/')
  .get(getOrder)// get orders
  .post(postOrder); // post orders

router.route('/:kitchenId')
  .patch(patchOrder); // update single order

router.route('/:dishId/count')
  .get(getDishCreationCount);

module.exports = router;
