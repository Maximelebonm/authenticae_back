const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const config = require('../configs/app.config');
const upload = require('../configs/multer.config');
const path = require('path')

const optioncontroller = require("../controllers/option.controller")

router.get("/");
router.get("/:id");
router.post("/create/:id", protect);
router.delete("/suboption/delete/:id", protect, optioncontroller.deleteSubOption);
router.delete("/delete/:id", protect, optioncontroller.deleteOption);
router.put("/update/:id");

module.exports = router