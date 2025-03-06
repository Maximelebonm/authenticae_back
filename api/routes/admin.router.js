const express = require('express');
require('dotenv').config()
const protect = require('../middlewares/auth.middleware');
const router = express.Router();
const stripe = require('../configs/stripe.config')
const userController = require("../controllers/user.controller");
const adminController = require('../controllers/admin.controller');
const config = require('../configs/app.config')

router.get("/users", userController.findAllUser);
router.get("/users/:id", userController.findUserByID);
router.post("/producer/role/add/:id", protect, adminController.addProducerRole); 
router.put("/producer/role/delete/:id", protect, adminController.deleteProducerRole);
router.put('/shop/delete/:id',protect, adminController.deleteShop)
router.put('/shop/undelete/:id',protect, adminController.undeleteShop)

router.get('/tva',protect, adminController.getTVA)
router.put('/tva/update/:id',protect, adminController.updateTVA)
router.post('/tva/add',protect, adminController.addTVA)
router.put('/tva/delete/:id',protect, adminController.deleteTVA)

router.get('/category',protect, adminController.getCategory)
router.put('/category/update/:id',protect, adminController.updateCategory)
router.post('/category/add',protect, adminController.addCategory)
router.put('/category/delete/:id',protect, adminController.deleteCategory)

router.get('/material',protect, adminController.getMaterial)
router.put('/material/update/:id',protect, adminController.updateMaterial)
router.post('/material/add',protect, adminController.addMaterial)
router.put('/material/delete/:id',protect, adminController.deleteMaterial)

router.post('/create-express-account/:id', async (req, res) => {
    try {
      // Créer un compte Express Stripe
      const account = await stripe.accounts.create({ type: 'express',business_type: 'individual',country: 'FR' });
      // Créer un lien d'onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${config.origin}/myshop`,
        return_url: `${config.origin}/myshop`,
        type: 'account_onboarding',
      });
      const linkBDD = await userController.addstripeUser(req,res, account.id)
      res.json({ url: accountLink.url });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

module.exports = router