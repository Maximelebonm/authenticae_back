const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const tvaSchema = db.define(
    "tva",
    {
        Id_tva : {
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
        tva_rate : {
            type : DataTypes.DECIMAL,
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
        tableName : "tva",
    }
    
    )
async function tableSync(){
    try {
        await db.sync();
       // console.log('Table tva Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = tvaSchema;