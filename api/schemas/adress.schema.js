const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const addressSchema = db.define(
    "address",
    {
        Id_address : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
        },
        country : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        cityCode : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        city : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        additional : {
            type : DataTypes.TEXT,
        },
        street : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        number : {
            type : DataTypes.TEXT,
            allowNull : false,
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
        tableName : "address",
    }
    )
async function tableSync(){
    try {
        await db.sync();
      //  console.log('Table Adress Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = addressSchema;