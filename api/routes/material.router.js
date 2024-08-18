const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const config = require('../configs/app.config');
const upload = require('../configs/multer.config');
const path = require('path')

const materialController = require('../controllers/material.controller')

router.get("/", materialController.findAllMaterials);
router.get("/:id", materialController.findMaterial);
// router.post("/create/:id", productController.createProduct)
// router.post("/uploadPictures/:id", upload.array('pictures', 5), productController.picturesProduct)
// router.put("/delete/:id", shopController.deleteShop)
// router.put("/update/:id", productController.updateProduct);

// router.post("/updateAvatar/:id",upload.single('avatar'), shopController.imageShop)
// router.post("/updateCover/:id",upload.single('cover'), shopController.imageShop)

module.exports = router