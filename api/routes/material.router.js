const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const config = require('../configs/app.config');
const upload = require('../configs/multer.config');
const path = require('path')

const materialController = require('../controllers/material.controller')

router.get("/", materialController.findAllMaterials);
router.get("/:id", materialController.findMaterial);


module.exports = router