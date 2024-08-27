const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const productSchema = require('./product.schema');
const optionSchema = require('./productOption.schema');
const subOptionSchema = require('./subOption.schema');

const personalizationSchema = db.define(
    "personalization",
    {
        Id_personalization : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
        },
        name : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        detail : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        price : {
            type : DataTypes.FLOAT,
            allowNull : false,
            defaultValue : 0,
        },
        personalizationActive : {
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
        tableName : "personalization",
    }
    )
// async function tableSync(){
//     try {
//         await db.sync();
//        // console.log('Table personalization Synchronisé');
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }



// tableSync()
module.exports = personalizationSchema;