const express = require('express');
const router = express.Router();
const script = require('../controllers/script.controller')

router.post("/", script.initData)

module.exports = router