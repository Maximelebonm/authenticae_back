const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const mrController = require("../controllers/mr.controller");




router.post("/createLabel", protect,mrController.MrCreateLabel);
//router.post("/test", protect,mrController.MrFirstRequest);
router.get("/:id", protect,mrController.MrGetLabel);


module.exports = router