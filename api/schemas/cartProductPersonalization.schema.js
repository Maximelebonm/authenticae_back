const {Sequelize, DataTypes} = require('sequelize');
const db = require("../configs/db.config");

const product = require('./product.schema');
const cart = require('./cart.schema');

const cart_product_personalization = db.define('cartproductpersonalization',{
    Id_cart_product_personalization: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue : Sequelize.UUIDV4,
        unique : true,
    },
    consumer_text : {
        type : DataTypes.TEXT,
        allowNull : false,
    },
    price : {
        type : DataTypes.FLOAT,
        allowNull : false,
        defaultValue : 0,
    },
    created_by : {
        type : DataTypes.CHAR,
        allowNull : false,
    },
    created_date : {
        type : DataTypes.DATE,
        defaultValue: new Date(),
        allowNull : false,
    },
    updated_by : {
        type : DataTypes.CHAR,
    },
    updated_date : {
        type : DataTypes.DATE,
    },
    deleted_by : {
        type : DataTypes.CHAR,
        defaultValue : false,
    },
    deleted_date : {
        type : DataTypes.DATE,
    },
},
{
    freezeTablename : true,
    timestamps : false,
    tableName : "cartproductpersonalization",
}
);

// async function tableSync(){
//     try {
//         await db.sync();
//       //  console.log('Table Cart Synchronisé');
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }

// tableSync()
module.exports = cart_product_personalization;