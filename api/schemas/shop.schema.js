const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const userSchema = require('./user.schema')

const shopSchema = db.define(
    "shop",
    {
        Id_shop : {
            type : DataTypes.UUID,
            primaryKey : true,
            defaultValue : Sequelize.UUIDV4,
            allowNull : false,
            unique : true,
        },
        name : {
            type : DataTypes.CHAR,
            allowNull : true,
        },    
        description : {
            type : DataTypes.CHAR,
            allowNull : true,
        },
        phone : {
            type : DataTypes.INTEGER,
        },
        profil_picture : {
            type : DataTypes.TEXT,
        },
        cover_picture : {
            type : DataTypes.TEXT,
        },
        social_media : {
            type : DataTypes.TEXT,
        },
        created_by : {
            type : DataTypes.CHAR,
            allowNull : false,
            defaultValue : 'admin'
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
        tableName : "shop",
    }
)

shopSchema.belongsTo(userSchema,{
    foreignKey : 'Id_user',
})

// async function tableSync(){
//     try {
//         await db.sync();
//         //console.log('Table User Synchronisé');
//     }catch (err){
//         console.log("erreur : " , err)
//     }
// }
// tableSync()
module.exports = shopSchema;