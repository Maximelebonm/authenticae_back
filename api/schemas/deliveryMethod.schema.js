const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const deliverymethodSchema = db.define(
    "deliverymethod",
    {
        Id_delivery_method : {
            type : DataTypes.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey : true,
            allowNull : false,
            unique : true,
        },
        name : {
            type : DataTypes.CHAR,
            allowNull : false,
            unique : true,
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
        tableName : "deliverymethod",
    }
    )
// async function tableSync(){
//     try {
//         await db.sync();
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }

// tableSync()
module.exports = deliverymethodSchema;