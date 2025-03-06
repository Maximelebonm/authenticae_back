const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const tvaController = require('../controllers/tva.controller')


router.get("/", protect, tvaController.findAllTva);


module.exports = router