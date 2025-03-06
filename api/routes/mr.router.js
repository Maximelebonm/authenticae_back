const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const mrController = require("../controllers/mr.controller");





router.post("/test", protect,mrController.MrFirstRequest);
router.get("/:id", );


module.exports = router