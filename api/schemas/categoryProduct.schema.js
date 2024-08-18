const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const categoryProductSchema = db.define(
    "categoryProduct",
    {
        Id_categoryProduct : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
        },
        name : {
            type : DataTypes.CHAR,
            allowNull : false,
            unique : true,
        },
        picture : {
            type : DataTypes.TEXT,
        },
        created_by : {
            type : DataTypes.CHAR,
            allowNull : false,
            defaultValue : 'script'
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
        tableName : "categoryProduct",
    }
    )
async function tableSync(){
    try {
        await db.sync();
      //  console.log('Table CategoryProduct Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = categoryProductSchema;