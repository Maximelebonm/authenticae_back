const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const roleSchema = db.define(
    "role",
    {
        Id_role : {
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
            type : DataTypes.CHAR,
        },
        created_by : {
            type : DataTypes.CHAR,
            defaultValue : 'script',
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
        tableName : "role",
    }
    
    )
async function tableSync(){
    try {
        await db.sync();
       // console.log('Table Role Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = roleSchema;