const orderSchema = require('../schemas/order.schema');
const orderProductSchema = require('../schemas/orderProduct');
const orderProductOptionSchema = require('../schemas/orderProductOption.schema');
const orderPersonalizationschema = require('../schemas/orderProductPersonalization.schema');
const cartSchema = require('../schemas/cart.schema');
const productSchema = require('../schemas/product.schema')
const productOptionSchema = require('../schemas/productOption.schema')
const productSubOptionSchema = require('../schemas/subOption.schema')
const productImageSchema = require('../schemas/product_image.schema')
const personalisationSchema = require('../schemas/personalization.schema')
const userSchema = require('../schemas/user.schema')
const db = require('../configs/db.config');
const subOptionSchema = require('../schemas/subOption.schema');
const shopSchema = require('../schemas/shop.schema');
const addressSchema = require('../schemas/adress.schema');
const { Op } = require('sequelize');

const createOrder = async (req,t,idStripe) => {
    // const t = await db.transaction();
    const { cart, products, user,address_billing,address_delivery } = req.body;
    
    try {
        // Créer la commande principale
        const createOrder = await orderSchema.create({
            order_state: "Pay",
            price: cart.price,
            order_delivery: 'En attente',
            payment_id : idStripe,
            payment_state : 'success',
            Id_delivery_address: address_delivery,
            Id_billing_address: address_billing,
            Id_user: cart.Id_user,
            created_by: 'user',
        }, { transaction: t });
    
        // Traiter les produits de la commande
        const orderProductPromises = products.map(async (element) => {
            const createOrderProduct = await orderProductSchema.create({
                price: element.price,
                order_state: 'wait',
                quantity: element.quantity,
                Id_order: createOrder.Id_order,
                Id_product: element.Id_product,
                created_by: 'user',
            }, { transaction: t });
    
            const NewStock = element.product.quantity_available - element.quantity;
    
            const updateStockPromise = productSchema.update({
                quantity_available: NewStock,
            }, {
                where: { Id_product: element.Id_product },
                transaction: t,
            });
    
            const optionPromises = element.cartproductoptions.map(async (optionItem) => {
                await orderProductOptionSchema.create({
                    price: optionItem.price,
                    Id_order_product: createOrderProduct.Id_order_product,
                    Id_product_option: optionItem.productoption.Id_product_option,
                    Id_subOption: optionItem.subOption.Id_subOption,
                    created_by: 'user',
                }, { transaction: t });
            });
    
            const personalizationPromises = element.cartproductpersonalizations.map(async (personalizationItem) => {
                await orderPersonalizationschema.create({
                    price: personalizationItem.price,
                    consumer_text: personalizationItem.consumer_text,
                    Id_order_product: createOrderProduct.Id_order_product,
                    Id_personalization: personalizationItem.Id_personalization,
                    created_by: 'user',
                }, { transaction: t });
            });
    
            // Attendre toutes les promesses
            await Promise.all([
                ...optionPromises,
                ...personalizationPromises,
                updateStockPromise,
            ]);
        });
    
        const promiseCart = cartSchema.update({ cart_state: "paid" }, {
            where: { Id_cart: cart.Id_cart },
            transaction: t
        });
    
        // Attendre toutes les promesses
        await Promise.all([orderProductPromises, promiseCart]);
    
        // await t.commit();  // Commit de la transaction
        return createOrder;  // Retourner la commande créée
    
    } catch (error) {
        await t.rollback();  // Rollback en cas d'erreur
        return error  // Relancer l'erreur pour la gestion en amont
    }
    
}

const cancelOrder = async (req,t) =>{
    try {
        const {products} = req.body
        const orderCanceled = await orderSchema.update({
            order_state : "canceled",
            payment_state : 'refund',
            deleted_by : 'user',
            refund : req.body.refund,
            deleted_date : Date.now(),
        },{where : {Id_order : req.params.id}, 
        transaction : t
        })
        const cancelOrderProductPromises = products.map(async (element) => {
            if(element.order_state !== "canceled"){
                const createOrderProduct = await orderProductSchema.update({
                    order_state: 'canceled',
                    deleted_by: 'user',
                }, {where: { Id_order_product: element.Id_order_product }, transaction: t })
            }
        });

        await Promise.all(cancelOrderProductPromises);

        return orderCanceled
    } catch (error) {
        return error
    }
}

const cancelOrderInProgress = async(req) =>{
    try {
        const orderProductUpdate = await orderProductSchema.update({
            order_state : 'waitingCancel',
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_order_product : req.params.id}
        })
    
        return orderProductUpdate
        
    } catch (error) {
        return error
    }
}

const cancelOrderPercent = async(req,transaction,refundProduct)=> {
    try {
        const finalRefund = req.body.refundAmount + refundProduct
      
        const cancelOrderProduct = await orderProductSchema.update({
            order_state: 'canceled',
            deleted_by: 'user',
            working_progress : req.body.percent,
        }, { where : {Id_order_product : req.params.id},transaction: transaction });
    
        const findOrderProductCanceled = await orderProductSchema.findAll({
            where : {Id_order : req.body.Id_order, order_state: {
            [Op.or]: ['canceled', 'send']
        }}
        })

        if(findOrderProductCanceled.length-1 === req.body.productaccount || req.body.productaccount == 1){
                const orderCanceled = await orderSchema.update({
                    payment_state : 'refund',
                    order_state : 'canceled',
                    updated_by : 'producer',
                    refund : finalRefund,
                    updated_date : Date.now(),
                },{where : {Id_order : req.body.Id_order}, 
                transaction : transaction
                })
            } else {
                const orderCanceled = await orderSchema.update({
                    payment_state : 'partialRefund',
                    updated_by : 'producer',
                    refund : finalRefund,
                    updated_date : Date.now(),
                },{where : {Id_order : req.body.Id_order}, 
                transaction : transaction
                })
            }
        return cancelOrderProduct
        
    } catch (error) {
        return error
    }
}
const getUserOrder = async(id)=>{
    try {
        const orderFinded = await orderSchema.findAll({
            where : {deleted_by : '0', Id_user : id},
            order: [['created_date', 'DESC']],
            include : [{
                model : orderProductSchema,
                required : true,
                include : [{
                        model : orderProductOptionSchema,
                        include : [{
                            model : productOptionSchema,
                            attributes : ['name'],
                        }, {
                            model : subOptionSchema,
                            attributes : ['detail'],
                        }],
                    },{
                        model : orderPersonalizationschema,
                        attributes : ['consumer_text','price'],
                        include : [{
                            model : personalisationSchema,
                            attributes : ['name','detail','price'],
                        }], 
                    },{                                              
                        model: productSchema,
                        attributes : ['name','detail','price','working_days'],
                        required : true,
                        include : [{
                            model : shopSchema,
                            attributes : ['name','profil_picture'],
                        },{
                            model : productImageSchema,
                            as: 'productImages',
                            attributes : ['storage','order'],
                            where : {order : 0}
                        }]
                }],
            },{
                model : userSchema,
                attributes : ['firstname','lastname','email']
            }],
        })
            return orderFinded   
    } catch (error) {
        return error
    }
}

const cancelOrderProductByUser = async(req,t,refund)=>{
    try {
        const cancelOrderProduct = await orderProductSchema.update({
            order_state: 'canceled',
            deleted_by: 'user',
        }, { where : {Id_order_product : req.params.id},transaction: t });
        
        const findOrderProductCanceled = await orderProductSchema.findAll({
            where : {Id_order : req.body.Id_order, order_state: {
            [Op.or]: ['canceled', 'send']
        }}
        })
        
        if(findOrderProductCanceled.length-1 === req.body.productAccount || req.body.productAccount == 1){
            const orderCanceled = await orderSchema.update({
                payment_state : 'refund',
                updated_by : 'user',
                order_state : 'canceled',
                refund : refund,
                updated_date : Date.now(),
            },{where : {Id_order : req.body.Id_order}, 
            transaction : t
            })
        } else {
            const orderCanceled = await orderSchema.update({
                payment_state : 'partialRefund',
                updated_by : 'user',
                refund : refund,
                updated_date : Date.now(),
            },{where : {Id_order : req.body.Id_order}, 
            transaction : t
            })
        }

        return cancelOrderProduct

    } catch (error) {
        return error
    }
}

const findProducerOrder = async(id)=> {
    try {
        const orderFinded = await orderSchema.findAll({
            where : {deleted_by : '0'},
            order: [['created_date', 'DESC']],
            include : [{
                model : orderProductSchema,
                required : true,
                include : [{
                        model : orderProductOptionSchema,
                        include : [{
                            model : productOptionSchema,
                            attributes : ['name'],
                        }, {
                            model : subOptionSchema,
                            attributes : ['detail'],
                        }],
                    },{
                        model : orderPersonalizationschema,
                        attributes : ['consumer_text','price'],
                        include : [{
                            model : personalisationSchema,
                            attributes : ['name','detail','price'],
                        }], 
                    },{                                              
                        model: productSchema,
                        attributes : ['name','detail','price','working_days'],
                        required : true,
                        include : [{
                            model : userSchema,
                            attributes : ['Stripe_ID'],
                            where : { Id_user : id},
                            required : true,
                        },{
                            model : productImageSchema,
                            as: 'productImages',
                            where: {archived: 0, order : 0},
                            attributes: ['storage'],      
                        }]
                }],
            },{
                model : userSchema,
                attributes : ['email','firstname','lastname'],
            },{
                model : addressSchema,
                as : 'DeliveryAddress',
                attributes : ['city','cityCode','country','additional','street','number'],
            }],
        })
            return orderFinded   
    } catch (error) {
        return error
    }
}

const productOrderProduction = async(id)=>{
    try {
        const orderProductUpdate = await orderProductSchema.update({
            order_state : 'production',
            updated_by : 'producteur',
            updated_date : Date.now()
        },{
            where : {Id_order_product : id},
        })
        return orderProductUpdate
    }catch (err){
        console.log(err)
        return err
    }
}

const cancelProductOrderProduction = async(id)=>{
    try {
        const orderProductUpdate = await orderProductSchema.update({
            order_state : 'wait',
            updated_by : 'producteur',
            updated_date : Date.now()
        },{
            where : {Id_order_product : id},
            returning: true,
            })
         return 'ok'

    }catch (err){
        console.log(err)
        return err
    }
}

const productOrderSend = async(req,t)=>{
    try {
        const orderProductUpdate = await orderProductSchema.update({
            order_state : 'send',
            updated_by : 'producteur',
            updated_date : Date.now()
        },{
            where : {Id_order_product : req.params.id},
            })
        
            const findOrderProduct = await orderProductSchema.findAll({
                where : {Id_order : req.body.Id_order, order_state: {
                [Op.or]: ['canceled', 'send']
            }}
            })
            if(findOrderProduct.length-1 === req.body.productAccount || req.body.productAccount == 1){
                const orderCanceled = await orderSchema.update({
                    updated_by : 'user',
                    order_state : 'finish',
                    updated_date : Date.now(),
                },{where : {Id_order : req.body.Id_order}, 
                transaction : t
                })
            }
         return "product update"

    }catch (err){
        console.log(err)
        return err
    }
}

const cancelProductOrderSend = async(id)=>{
    try {
        const orderProductUpdate = await orderProductSchema.update({
            order_state : 'production',
            updated_by : 'producteur',
            updated_date : Date.now()
        },{
            where : {Id_order_product : id},
            returning: true,
            })
         return 'ok'

    }catch (err){
        console.log(err)
        return err
    }
}

module.exports = {createOrder,findProducerOrder,productOrderProduction,cancelProductOrderProduction,productOrderSend,cancelProductOrderSend,getUserOrder,cancelOrder,cancelOrderProductByUser,cancelOrderInProgress,cancelOrderPercent}