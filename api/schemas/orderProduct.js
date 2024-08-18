const {Sequelize, DataTypes} = require('sequelize');
const db = require("../configs/db.config");

const orderProduct = db.define('orderproduct',{
    Id_order_product: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue : Sequelize.UUIDV4,
        unique : true,
    },
    price : {
        type : DataTypes.FLOAT,
        allowNull : false,
        defaultValue : 0,
    },
    order_state : {
        type : DataTypes.CHAR,
        allowNull : false,
    },
    working_progress : {
        type : DataTypes.INTEGER,
    },
    quantity : {
        type : DataTypes.INTEGER,
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
    tableName : "orderproduct",
}
);

async function tableSync(){
    try {
        await db.sync();
      //  console.log('Table Cart_product Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = orderProduct;