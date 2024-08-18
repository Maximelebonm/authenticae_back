const {Sequelize, DataTypes} = require('sequelize');
const db = require("../configs/db.config");

const cart_product_option = db.define('cartproductoption',{
    Id_cart_product_option: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue : Sequelize.UUIDV4,
        unique : true,
    },
    // clefs étrangère
    price : {
        type : DataTypes.FLOAT,
        allowNull : false,
        defaultValue : 0,
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
    tableName : "cartproductoption",
}
);

async function tableSync(){
    try {
        await db.sync();
      //  console.log('Table Cart Synchronisé');
    }catch (err){
        console.log("erreur : " , err)
    }
}

tableSync()
module.exports = cart_product_option;