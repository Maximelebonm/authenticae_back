require('dotenv').config()
const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const stripeClient = require('../configs/stripe.config')
const orderController = require('../controllers/order.controller')
const db = require('../configs/db.config');

router.get("/producer/:id" , orderController.getProducerOrder)
router.get('/usercommands/:id', protect, orderController.getUserOrder);
router.post('/producer/working_progress/:id', protect, orderController.cancelOrderInProgress);

router.post('/cancelpercent/:id', protect,async (req, res) => {
  let { percent,idpayement,refundAmount,productPrice} = req.body;
  const transaction = await db.transaction();
  try {
    const amoutInProgress = productPrice * percent / 100
    const finalAmouteuro = productPrice - amoutInProgress
    const finalAmoutCents = finalAmouteuro * 100


    // Création de l'intention de paiement

    const refundStripe = await stripeClient.refunds.create({
      payment_intent: idpayement,
      amount: finalAmoutCents,
    });

      // Vérifiez que le remboursement à réussie
      if (refundStripe.status === 'succeeded') {
          // Mettre à jour la base de données
          const BddMaj = await orderController.cancelOrderPercent(req, transaction,finalAmouteuro);
          if (BddMaj[0]===1) {
              await transaction.commit();
              res.send({
                  message: "produit annulé",
                  success: true,
              });
            }
      } else {
          throw new Error('refund fail');
        }
      } catch (error) {
        await transaction.rollback();
        res.send({
            message: "refund failed",
            success: false,
        });
  }
})

//en test pour générér des fonds
// const testCharge = await stripe.charges.create({
//   amount: 200000, // Montant de test
//   currency: 'EUR',
//   source: 'tok_bypassPending', // Carte de test spéciale
// });
// }
router.post('/producer/send/:id', protect, async (req, res) => {
  let { IdPayement,stripe_ID,amountProduct} = req.body;
  const transaction = await db.transaction();
  try {
      // Création de l'intention de paiement
      const amoutPercents = amountProduct * 5 / 100
      const amoutFinal = amountProduct - amoutPercents
      const amountCents = amoutFinal * 100

      const transfer = await stripeClient.transfers.create({
                amount: amountCents,
                currency: 'EUR',
                destination: stripe_ID,
                transfer_group: IdPayement,
            });
   
      // Vérifiez que le remboursement à réussie
      if (transfer.amount > 0 ) {
          // Mettre à jour la base de données
          const BddMaj = await orderController.productOrderSend(req, transaction);
          if (BddMaj == "produit envoyé") {
              await transaction.commit();
              res.send({
                  message: "produit envoyé",
                  success: true,
              });
            } else if(BddMaj == "mis à jours no mail"){
              await transaction.commit();
              res.send({
                  message: "mis à jours no mail",
                  success: true,
              });
            }
      } else {
          throw new Error('refund fail');
        }
      } catch (error) {
        await transaction.rollback();
        res.send({
            message: "refund failed",
            success: false,
        });
  }
});

router.post('/stripe/cancel/product/:id', protect, async (req, res) => {
  let { paymentid,amountCommand,amountProduct,refund} = req.body;
  const transaction = await db.transaction();
  try {
    const amoutRefundCents = refund * 100
    const amountCommandsCents = amountCommand * 100
    const amountProductTotal = amountProduct * 100
    if(amoutRefundCents < amountCommandsCents){
      // Création de l'intention de paiement
      const refundStripe = await stripeClient.refunds.create({
        payment_intent: paymentid,
        amount: amountProductTotal,
      });

      const totalAmoutRefundCents = amountProductTotal + amoutRefundCents
      const amountRefundEuro = totalAmoutRefundCents / 100
   
      // Vérifiez que le remboursement à réussie
      if (refundStripe.status === 'succeeded') {
          // Mettre à jour la base de données
          const BddMaj = await orderController.cancelOrderProductByUser(req, transaction,amountRefundEuro);
          if (BddMaj[0]===1) {
              await transaction.commit();
              res.send({
                  message: "produit annulé",
                  success: true,
              });
            }
      } else {
          throw new Error('refund fail');
        }
    }
      } catch (error) {
        await transaction.rollback();
        res.send({
            message: "refund failed",
            success: false,
        });
  }
});

router.post('/stripe/cancel/:id', protect, async (req, res) => {
  let { paymentid,amount,refund,order_state } = req.body;
  const transaction = await db.transaction();
  if((order_state !== "canceled" || order_state !=="finish")){
    try {
      const amountCents = amount * 100
      const refundCents = refund * 100
      const amountTotal = amountCents - refundCents
        // Création de l'intention de paiement
        if(amountTotal > 0){
          const refundStripe = await stripeClient.refunds.create({
            payment_intent: paymentid,
            amount: amountTotal,
          });
    
          // Vérifiez que le remboursement à réussie
          if (refundStripe.status === 'succeeded') {
              // Mettre à jour la base de données
              const BddMaj = await orderController.cancelOrder(req, transaction,'A');
              if (BddMaj[0]===1) {
                  await transaction.commit();
                  res.send({
                      message: "commande annulé",
                      success: true,
                  });
                }
          } else {
              res.send({message : 'remboursement failed'})
            }
        } else {
          res.send({message : "remboursement supérieur au montant"})
        }
    } catch (error) {
      if(error.code == "charge_already_refunded"){
        const majOrder = await orderController.cancelOrder(req,transaction,'DA')
        if(majOrder[0]===1){
          await transaction.commit();
          res.send({
            message: "commande déja annulé",
            success: true,
        });
        }
      } else {
        await transaction.rollback();
        res.send({
            message: "remboursement failed",
            success: false,
        });
      }
    }
    } else {
      try {
        const majOrder = await orderController.cancelOrder(req,transaction,'DA')
        if(majOrder[0]===1){
          await transaction.commit();
          res.send({
            message: "commande déja annulé",
            success: true,
        });
        }
      } catch (error) {
        res.send({
          message: "une erreur est survenue",
          success: true,
      });
      }
    }
});
router.post("/stripe/charge", protect, async (req, res) => {
  let { amount, id } = req.body;
  console.log(amount, id);
  const transaction = await db.transaction();
  let payment
  try {
      // Création de l'intention de paiement
      payment = await stripeClient.paymentIntents.create({
          amount: amount,
          currency: "EUR",
          description: "authenticae payment",
          payment_method: id,
          confirm: true,
          return_url: 'http://localhost:5173'
      });

      const paymentIntentStatus = await stripeClient.paymentIntents.retrieve(payment.id);

      // Vérifiez que le paiement a réussi
      if (paymentIntentStatus.status === 'succeeded') {
          // Mettre à jour la base de données
          const BddMaj = await orderController.createOrder(req, transaction,payment.id);
          if (BddMaj) {
              await transaction.commit();
              res.clearCookie('cart');
              res.send({
                  message: "payment succeeded",
                  success: true,
              });
            }
      } else {
          throw new Error('Payment failed');
        }
      } catch (error) {
        await stripeClient.paymentIntents.cancel(payment.id);
        await transaction.rollback();
        console.log(error);
        res.send({
            message: "payment failed",
            success: false,
        });
  }
});

router.post('/producer/accepted/:id', protect, orderController.productOrderProduction)
router.post('/producer/cancelAccepted/:id', protect, orderController.cancelProductOrderProduction)
router.post('/producer/cancelsend/:id', protect, orderController.cancelProductOrderSend)

module.exports = router