const express = require('express');

const { getReport } = require('../handler/report.handler');

const router = express.Router();
router.route('/')
  .get(getReport);

module.exports = router;
