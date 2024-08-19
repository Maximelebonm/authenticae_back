const express = require('express')
const router = express.Router();

router.use(express.urlencoded({extended : true}))
router.use(express.json())

const userRoutes = require('./user.router');
const scriptRoutes = require('./script.router')
const shopRoutes = require('./shop.router')
const adminRoutes = require('./admin.router')
const productRoutes = require('./product.router')
const materialRoutes = require('./material.router')
const optionRoutes = require('./option.router')
const personalizationRoutes = require('./personalization.router')
const cartRoutes = require('./cart.router')
const addressRoutes = require('./address.router')
const orderRoutes = require('./order.router')

router.use('/api/users', userRoutes);
router.use('/api/script', scriptRoutes);
router.use('/api/shop', shopRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/product', productRoutes)
router.use('/api/material', materialRoutes)
router.use('/api/option', optionRoutes)
router.use('/api/personalization', personalizationRoutes)
router.use('/api/cart', cartRoutes)
router.use('/api/address', addressRoutes)
router.use('/api/order' , orderRoutes)

module.exports = router