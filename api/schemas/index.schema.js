const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config");

const userSchema = require('./user.schema');
const user_role = require('./user_role.schema');
const roleSchema = require('./role.schema');
const adressSchema = require('./adress.schema');

const shopSchema = require('./shop.schema')
const materialSchema = require('./material.schema')
const subCategoryProductSchema = require('./subCategoryProduct.schema')
const categoryProductSchema = require('./categoryProduct.schema');

const productSchema = require('./product.schema');
const productImagesSchema = require('./product_image.schema')
const personalizationSchema = require('./personalization.schema')
const productOptionSchema = require('./productOption.schema');
const subOptionSchema = require('./subOption.schema')
const tvaSchema = require('./tva.schema');

const claimSchema = require('./claim.schema');


const cartSchema = require('./cart.schema');
const cartProductschema = require('./cartProduct.schema');
const cartProductOptionSchema = require('./cartProductOption.schema')
const cartProductPersonalization = require('./cartProductPersonalization.schema')

const orderSchema = require('./order.schema');
const orderProductschema = require('./orderProduct');
const orderProductOptionSchema = require('./orderProductOption.schema');
const orderProductPersonalizationSchema = require('./orderProductPersonalization.schema')

db.sync()
// *** RELATIONS ORDER ***//
// relation de adress
adressSchema.hasMany(orderSchema, {foreignKey: 'Id_delivery_address'})
adressSchema.hasMany(orderSchema, {foreignKey: 'Id_billing_address'})


//relation de order
orderSchema.belongsTo(userSchema, {foreignKey: 'Id_user'});
orderSchema.hasMany(orderProductschema, {foreignKey : 'Id_order'});
orderSchema.belongsTo(adressSchema, { as: 'DeliveryAddress', foreignKey: 'Id_delivery_address' });
orderSchema.belongsTo(adressSchema, { as: 'BillingAddress', foreignKey: 'Id_billing_address' });

//relation de orderProduct
orderProductschema.belongsTo(orderSchema, {foreignKey : 'Id_order'});
orderProductschema.belongsTo(productSchema, { foreignKey: 'Id_product'});
orderProductschema.hasMany(orderProductOptionSchema,{foreignKey: 'Id_order_product'});
orderProductschema.hasMany(orderProductPersonalizationSchema,{foreignKey: 'Id_order_product'});

//relation de orderProductOption
orderProductOptionSchema.belongsTo(orderProductschema, {foreignKey: 'Id_order_product'});
orderProductOptionSchema.belongsTo(productOptionSchema, {foreignKey: 'Id_product_option'});
orderProductOptionSchema.belongsTo(subOptionSchema, {foreignKey: 'Id_subOption'});

//relation de orderProductPersonalization
orderProductPersonalizationSchema.belongsTo(personalizationSchema,{foreignKey: 'Id_personalization'})

//*** RELATIONS CART ***//
//Relation de CART
cartSchema.belongsTo(userSchema, {foreignKey: 'Id_user'});
cartSchema.hasMany(cartProductschema, {foreignKey : 'Id_cart', as : 'cartProduct'});

//relation de cart_product
cartProductschema.belongsTo(productSchema, { foreignKey: 'Id_product'});
cartProductschema.belongsTo(cartSchema, {foreignKey: 'Id_cart'});
cartProductschema.hasMany(cartProductOptionSchema,{foreignKey: 'Id_cart_product'});
cartProductschema.hasMany(cartProductPersonalization,{foreignKey: 'Id_cart_product'});

//Relation de cart_product_option
cartProductOptionSchema.belongsTo(cartProductschema, {foreignKey: 'Id_cart_product'});
cartProductOptionSchema.belongsTo(productOptionSchema, {foreignKey: 'Id_product_option'});
cartProductOptionSchema.belongsTo(subOptionSchema, {foreignKey: 'Id_subOption'});

//relation de cart Personalization
cartProductPersonalization.belongsTo(cartProductschema, {foreignKey: 'Id_cart_product'})
cartProductPersonalization.belongsTo(personalizationSchema,{foreignKey: 'Id_personalization'})

//*** RELATIONS Product ***//

//relation categoy Produt
categoryProductSchema.hasMany(subCategoryProductSchema,{foreignKey : 'Id_categoryproduct'})
//Relation sous category de Produit
subCategoryProductSchema.belongsTo(categoryProductSchema,{foreignKey : 'Id_categoryproduct',allowNull : false,})

// Relation de Product
productSchema.belongsTo(userSchema, {foreignKey: 'Id_user'});
productSchema.belongsTo(materialSchema,{foreignKey : 'Id_material'});
productSchema.belongsTo(shopSchema,{foreignKey : 'Id_shop'});
productSchema.belongsTo(tvaSchema,{foreignKey : 'Id_tva'});
productSchema.belongsTo(subCategoryProductSchema, {foreignKey: 'Id_subcategoryproduct'});
productSchema.hasMany(productImagesSchema, { foreignKey: 'Id_product', as: 'productImages' });
productSchema.hasMany(personalizationSchema, { foreignKey: 'Id_product', as: 'personalization' });
productSchema.hasMany(productOptionSchema, { foreignKey: 'Id_product', as: 'productOption' });
productSchema.hasMany(cartProductschema, { foreignKey: 'Id_product', as: 'cartProduct' });
productSchema.hasMany(orderProductschema, { foreignKey: 'Id_product', as: 'orderProduct' });

//relation Material
materialSchema.hasMany(productSchema, { foreignKey: 'Id_material', as: 'material' });

// Relation de ProductImage
productImagesSchema.belongsTo(productSchema, { foreignKey: 'Id_product' });

// Relation de productOption
productOptionSchema.belongsTo(productSchema, { foreignKey: 'Id_product' });
productOptionSchema.hasMany(subOptionSchema, { foreignKey: 'Id_product_option', as: 'subOptions' });
productOptionSchema.hasMany(cartProductOptionSchema, {foreignKey: 'Id_product_option'});
productOptionSchema.hasMany(orderProductOptionSchema, {foreignKey: 'Id_product_option'});


//relation de product subOption
subOptionSchema.belongsTo(productOptionSchema, { foreignKey: 'Id_product_option' });


// Relation : personalisation
personalizationSchema.belongsTo(productSchema, { foreignKey: 'Id_product' });
personalizationSchema.hasMany(cartProductPersonalization,{foreignKey: 'Id_personalization'});
personalizationSchema.hasMany(orderProductPersonalizationSchema,{foreignKey: 'Id_personalization'});

//*** RELATIONS USER ***//
// Relation : user
userSchema.hasMany(adressSchema, { foreignKey: 'Id_user' })
userSchema.hasMany(productSchema, { foreignKey: 'Id_user' })
userSchema.hasMany(claimSchema, { foreignKey: 'Id_user' })
userSchema.hasMany(orderSchema, {foreignKey: 'Id_user'})
userSchema.hasMany(cartSchema, { foreignKey: 'Id_user' })
userSchema.hasOne(shopSchema, { foreignKey: 'Id_user' })

//relation Shop
shopSchema.belongsTo(userSchema,{foreignKey : 'Id_user'});
shopSchema.hasMany(productSchema, { foreignKey: 'Id_shop' })

// Relation Adress
adressSchema.belongsTo(userSchema, { foreignKey: 'Id_user' });

//relation claim (reclamation)
claimSchema.belongsTo(userSchema,{foreignKey : 'Id_user'});
