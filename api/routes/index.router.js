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

router.use('/users', userRoutes);
router.use('/script', scriptRoutes);
router.use('/shop', shopRoutes);
router.use('/admin', adminRoutes);
router.use('/product', productRoutes)
router.use('/material', materialRoutes)
router.use('/option', optionRoutes)
router.use('/personalization', personalizationRoutes)
router.use('/cart', cartRoutes)
router.use('/address', addressRoutes)
router.use('/order' , orderRoutes)

module.exports = router