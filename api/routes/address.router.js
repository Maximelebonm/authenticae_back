const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const addressController = require("../controllers/address.controller")

router.get("/");
router.get("/:id");
router.post("/create/:id", protect, addressController.createAddress)
router.put("/delete/:id", protect, addressController.deleteAddress)
// router.delete("/delete/:id", protect, optioncontroller.deleteOption)
router.put("/update/:id", protect, addressController.updateAdress);

module.exports = router