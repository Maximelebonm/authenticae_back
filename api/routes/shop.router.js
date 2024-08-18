const express = require('express');
const shopController = require("../controllers/shop.controller");
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const config = require('../configs/app.config');
const upload = require('../configs/multer.config');
const path = require('path')

router.get("/", shopController.findAllShop);
router.get("/:id", shopController.findShop);
router.get("/find/:id", shopController.findShopById);
router.post("/create/:id",protect, shopController.createShop)
router.put("/delete/:id", protect,shopController.deleteShop)
router.put("/update/:id",protect, shopController.updateShop);

router.post("/updateAvatar/:id",protect,upload.single('avatar'), shopController.imageShop)
router.post("/updateCover/:id",protect, upload.single('cover'), shopController.imageShop)

module.exports = router