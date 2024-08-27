const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config");
const User = require('./user.schema')

const claimSchema = db.define(
    "claim",
    {
        Id_claim : {
            type : DataTypes.UUID,
            primaryKey : true,
            allowNull : false,
            defaultValue : Sequelize.UUIDV4,
            unique : true,
        },
        title : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        description : {
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
        tableName : "claim",
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
module.exports = claimSchema;