const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const optionSchema = require('./productOption.schema')
const subOptionSchema = db.define(
    "subOption",
    {
        Id_subOption : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
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
        quantity_available : {
            type : DataTypes.INTEGER,
        },
        quantity_reservation : {
            type : DataTypes.INTEGER,
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
        tableName : "subOption",
    }
    )
async function tableSync(){
    try {
        await db.sync();
       // console.log('Table personalization Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

subOptionSchema.belongsTo(optionSchema,{foreignKey : 'Id_product_option'})

tableSync()
module.exports = subOptionSchema;