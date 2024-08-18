const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const config = require('../configs/app.config');
const upload = require('../configs/multer.config');
const path = require('path');

const productController = require('../controllers/product.controller');

router.get("/", productController.findAllProducts);
router.get("/:id", productController.findProduct);
router.post("/create/:id", protect, productController.createProduct);

router.post("/checkUploadPictures/:id", protect, productController.checkUploadPictures);

router.post("/uploadPictures/:id", protect, upload.array('pictures', 8), productController.picturesProduct);

router.delete("/delete/:id", protect, productController.deleteProduct);
router.put("/update/:id", protect, productController.updateProduct);
router.put('/archivePicture/:id', protect, productController.archivePicture);
router.put('/downPicture/:id', protect, productController.downPicture);
router.put('/upPicture/:id', protect, productController.upPicture);
router.delete('/deletePicture/:id', protect, productController.deletePicture);

module.exports = router