const express = require('express');
require('dotenv').config()
const protect = require('../middlewares/auth.middleware');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET);
const userController = require("../controllers/user.controller");
const adminController = require('../controllers/admin.controller')

router.get("/", userController.findAllUser);
router.get("/:id", userController.findUserByID);
router.post("/producer/role/add/:id", protect, adminController.addProducerRole); 
router.put("/producer/role/delete/:id", protect, adminController.deleteProducerRole);
router.put('/shop/delete/:id',protect, adminController.deleteShop)
router.put('/shop/undelete/:id',protect, adminController.undeleteShop)

router.post('/create-express-account/:id', async (req, res) => {
    try {
      // Créer un compte Express Stripe
      const account = await stripe.accounts.create({ type: 'express' });
      // Créer un lien d'onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://localhost:5173/reauth',
        return_url: 'https://localhost:5173/return',
        type: 'account_onboarding',
      });
      const linkBDD = await userController.addstripeUser(req,res, account.id)
      res.json({ url: accountLink.url });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

module.exports = router