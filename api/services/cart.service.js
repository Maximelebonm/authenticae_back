const { where } = require('sequelize');
const cartSchema = require('../schemas/cart.schema');
const cartProductSchema = require('../schemas/cartProduct.schema');
const cartProductOptionSchema = require('../schemas/cartProductOption.schema');
const cartProductPersonalizationSchema = require('../schemas/cartProductPersonalization.schema');
const productSchema = require('../schemas/product.schema');
const productOptionSchema = require('../schemas/productOption.schema');
const productPersonalizationSchema = require('../schemas/personalization.schema')
const subOptionSchema = require('../schemas/subOption.schema')
const productImageSchema = require('../schemas/product_image.schema');
const userSchema = require('../schemas/user.schema');
const db = require('../configs/db.config');

const findCartAndProducts = async(id)=>{
    try {
        const response = await cartSchema.findOne({where : {Id_cart : id , cart_state : 'active'},
            attributes: ['Id_cart','Id_user','cart_state','price'],
            include: [{
                        model: cartProductSchema,
                        as : 'cartProduct',
                        attributes: ['Id_cart_product','Id_product','price','quantity'],
                        include : [{
                            model : productSchema,
                            attributes: ['Id_product','price','name','quantity_available','quantity_reservation'],
                            include :[ {
                                model : productImageSchema,
                                as: 'productImages',
                                where: {archived: 0},
                                attributes: ['Id_product','Id_product_image','name','storage','order'],      
                            },{
                                model : userSchema
                            }
                        ]
                        },                        
                        {
                            model: cartProductOptionSchema,
                            attributes: ['Id_cart_product_option','Id_product_option','Id_subOption','price'],
                            include : [{
                                model : subOptionSchema,
                                attributes: ['Id_product_option','Id_subOption','detail','price','quantity_available','quantity_reservation'],
                            },{
                                model : productOptionSchema,
                                attributes: ['Id_product_option','name'],
                            }],
                        }, {
                            model: cartProductPersonalizationSchema,
                            include : [{
                                model : productPersonalizationSchema,
                            }],
                        }],
                    }],
                    order: [
        [
            { model: cartProductSchema, as: 'cartProduct' },
            { model: productSchema },
            { model: productImageSchema, as: 'productImages' }, 
            'order', 
            'ASC'
        ]
    ]
                })
            return response
        
    } catch (error) {
        return error
    }
}


const findActiveCart = async(id) => {
    return await cartSchema.findAll({where : {Id_user : id , cart_state : 'active'},
    include: [{
                model: cartProductSchema,
                as : 'cartProduct',
                include : [{
                    model: cartProductOptionSchema,
                },{
                    model: cartProductPersonalizationSchema,
                }]
            }]
        })
}

const createCart = async (req,res,Id_user) =>{
    try {
        const t = await db.transaction();
        const createCart = await cartSchema.create({
            cart_state : "active",
            price : req.body.product.price,
            Id_user : Id_user,
            created_by : 'user',
        }, { transaction: t })
        if(createCart){
            const createCartProduct = await cartProductSchema.create({
                price : req.body.product.price,
                quantity : req.body.product.quantity,
                Id_cart : createCart.Id_cart,
                Id_product : req.body.product.Id_product,
                created_by : 'user',
            }, { transaction: t })
            if(createCartProduct && req.body.options.length >= 1){
                const optionPromises = req.body.options.map(async(optionItem) => {
                    const createProductOptions = await cartProductOptionSchema.create({
                        price : optionItem.price,
                        Id_cart_product : createCartProduct.Id_cart_product,
                        Id_product_option : optionItem.option,
                        Id_subOption : optionItem.subOption,	
                        created_by : 'user',
                    }, { transaction: t })      
                });
                await Promise.all(optionPromises);
            }
            if(createCartProduct && req.body.personalizations.length >=1){
                const personalizationPromises = req.body.personalizations.map(async(personalizationItem) => {
                    const createProductpersonalization = await cartProductPersonalizationSchema.create({
                        price : personalizationItem.price,
                        Id_cart_product : createCartProduct.Id_cart_product,
                        consumer_text : personalizationItem.value,
                        Id_personalization : personalizationItem.Id_personalization,
                        created_by : 'user',
                    }, { transaction: t })
                })
                await Promise.all(personalizationPromises);
            }
        }
        
        await t.commit();

        return await cartSchema.findOne({
            where : {Id_cart : createCart.Id_cart},
            include: [{
                model: cartProductSchema,
                as : 'cartProduct',
                include : [{
                    model: cartProductOptionSchema,
                },{
                    model: cartProductPersonalizationSchema,
                }]
            }]
        })
    } catch (error) {
        await t.rollback();
        return error
    }
}

const updateAddCart = async(req,cart)=>{
    try {
        const t = await db.transaction();
        const PriceCart = req.body.product.price + cart.price
        const UpdateCartProduct = await cartSchema.update({
            price : PriceCart,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_cart : cart.Id_cart},
            returning: true,
            transaction: t 
        });
        if(UpdateCartProduct[1]=== 1){
            const createCartProduct = await cartProductSchema.create({
                price : req.body.product.price,
                quantity : req.body.product.quantity,
                Id_cart : cart.Id_cart,
                Id_product : req.body.product.Id_product,
                created_by : 'user',
            },{ transaction: t });
            if(createCartProduct && req.body.options.length >= 1){
                const createOptionsPromise = req.body.options.map(async(item) => {
                await cartProductOptionSchema.create({
                        price : item.price,
                        Id_cart_product : createCartProduct.Id_cart_product,
                        Id_product_option : item.option,
                        Id_subOption : item.subOption,	
                        created_by : 'user',
                    },{ transaction: t })      
                });
                await Promise.all(createOptionsPromise)
            }
            if(createCartProduct && req.body.personalizations.length >= 1){
                const createPersonalizationPromise = req.body.personalizations.map(async(item)=>{
                    await cartProductPersonalizationSchema.create({
                        price : item.price,
                        Id_cart_product : createCartProduct.Id_cart_product,
                        consumer_text : item.value,
                        Id_personalization : item.Id_personalization,
                        created_by : 'user',
                    },{ transaction: t })
                })
                await Promise.all(createPersonalizationPromise)
            }
        }

        await t.commit();
        return 'ok'
    } catch (error) {
        await t.rollback();
        return error
    }
}

const deleteProductCart = async(req,cart)=>{
    try {
        const t = await db.transaction();
        const PriceCart =  cart.price - req.body.product.price
        let option = req.body.options.length
        let personalization = req.body.personalizations.length
        if(req.body.options.length >= 1){
            req.body.options.forEach(async(item) => {
                await cartProductOptionSchema.destroy({where : {Id_cart_product_option : item.id},transaction: t })      
            });
            option = 0
        }
        if(req.body.personalizations.length >= 1){
            req.body.personalizations.forEach(async(item) => {
            await cartProductPersonalizationSchema.destroy({
                where : {Id_cart_product_personalization : item.id},
                transaction: t 
            })
        });
            personalization = 0
        }
        if(option == 0 && personalization == 0){
            await cartProductSchema.destroy({where : {Id_cart_product : req.body.product.id},transaction: t })
            
            const UpdateCartProduct = await cartSchema.update({
                price : PriceCart,
                updated_by : 'user',
                updated_date : Date.now()
            },{
                where : {Id_cart : cart.Id_cart},
                returning: true,
                transaction: t, 
            });

            await t.commit();
            return 'ok'
        }

    } catch (error) {
        await t.rollback();
        return error
    }
}

module.exports = {createCart,updateAddCart, findActiveCart,findCartAndProducts,deleteProductCart}