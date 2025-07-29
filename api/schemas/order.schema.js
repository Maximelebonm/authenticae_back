const {Sequelize, DataTypes, or} = require('sequelize')
const db = require("../configs/db.config")
const addressSchema = require('./adress.schema');
const deliveryMethodSchema = require('./deliveryMethod.schema');
const orderStateSchema = require('./orderstate.schema');

const orderSchema = db.define(
    "orders",
    {
        Id_order : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
        },
        Id_order_state: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: orderStateSchema,
                key: 'Id_order_state',
            },
        },
        price : {
            type : DataTypes.FLOAT,
            allowNull : false,
            defaultValue : 0,
        },
        refund : {
            type : DataTypes.FLOAT,
            allowNull : false,
            defaultValue : 0,
        },
        storage_facture : {
            type : DataTypes.CHAR,
        },
        number_facture : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        payment_id : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        Id_delivery_address: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: addressSchema,
                key: 'Id_address',
            }, 
        },
        pickup_location : {
            type: DataTypes.CHAR,
            allowNull: true,
        },
        pickup_location_name : {
            type: DataTypes.CHAR,
            allowNull: true,
        },
        Id_billing_address: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: addressSchema,
                key: 'Id_address',
            },
        },
        Id_delivery_method: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: deliveryMethodSchema,
                key: 'Id_delivery_method',
            },
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
        tableName : "orders",
    }
    
    )

// async function tableSync(){
//     try {
//         await db.sync();
//       //  console.log('Table Order Synchronisé');
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }

// tableSync()
module.exports = orderSchema;