const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const orderStateSchema = db.define(
    "orderstate",
    {
        Id_order_state : {
            type : DataTypes.NUMBER,
            primaryKey : true,
            allowNull : false,
            autoIncrement: true,
            unique : true,
        },
        name : {
            type : DataTypes.CHAR,
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
        tableName : "orderstate",
    }
    )

module.exports = orderStateSchema;