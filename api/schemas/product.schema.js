const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config");

const tva = require('./tva.schema')
const user = require('./user.schema')
const material = require('./material.schema');
const subcategoryproduct = require('./subCategoryProduct.schema');
const shopSchema = require('./shop.schema')


const productSchema = db.define(
    "product",
    {
        Id_product : {
            type : DataTypes.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
            unique : true,
        },
        name : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        description : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        detail : {
            type : DataTypes.TEXT,
        },
        price : {
            type : DataTypes.FLOAT,
        },
        quantity_available : {
            type : DataTypes.INTEGER,
        },
        quantity_reservation : {
            type : DataTypes.INTEGER,
        },
        pictures : {
            type : DataTypes.TEXT,
        },
        working_days : {
            type : DataTypes.INTEGER,
        },
        available : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue: true,
        },
        on_command : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue: false,
        },
        reservation : {
            type : DataTypes.BOOLEAN,
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
        tableName : "product",
    }
)

// async function tableSync(){
//     try {
//         await db.sync();
//        // console.log('Table Product Synchronisé');
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }

// tableSync()
module.exports = productSchema;