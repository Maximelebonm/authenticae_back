const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const MaterialSchema = db.define(
    "material",
    {
        Id_material : {
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
        picture : {
            type : DataTypes.TEXT,
        },
        created_by : {
            type : DataTypes.CHAR,
            allowNull : false,
            defaultValue : 'script',
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
        tableName : "material",
    }
    )
async function tableSync(){
    try {
        await db.sync();
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = MaterialSchema;