const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const cartController = require("../controllers/cart.controller")

router.get("/");
router.get("/:id", protect, cartController.findCartAndProducts);
router.post("/cartcontrol", protect, cartController.cartControl)
// router.delete("/suboption/delete/:id", protect, optioncontroller.deleteSubOption)
// router.delete("/delete/:id", protect, optioncontroller.deleteOption)
// router.put("/update/:id");

module.exports = router