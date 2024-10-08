const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const productSchema = require('./product.schema')

const productOptionSchema = db.define(
    "productoption",
    {
        Id_product_option : {
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
        optionActive : {
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
        freezeTableName : true,
        timestamps : false,
        tableName : "productoption",
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
module.exports = productOptionSchema;