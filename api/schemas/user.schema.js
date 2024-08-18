const {Sequelize, DataTypes} = require('sequelize')
const db = require("../configs/db.config")

const userSchema = db.define(
    "users",
    {
        Id_user : {
            type : DataTypes.UUID,
            primaryKey : true,
            defaultValue : Sequelize.UUIDV4,
            allowNull : false,
            unique : true,
        },
        Google_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Stripe_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstname : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        identifiant : {
            type : DataTypes.CHAR,
            unique : true,
        },
        lastname : {
            type : DataTypes.CHAR,
            allowNull : false,
        },
        birthdate : {
            type : DataTypes.DATEONLY,
            allowNull: function() {
                return this.Google_ID ? true : false; // Rendre la colonne nullable si Google_ID est défini
            }
        },
        email : {
            type : DataTypes.CHAR,
            unique : true,
            allowNull:false,
            validate : {
                isEmail : true,
            }
        },
        phone : {
            type : DataTypes.INTEGER,
        },
        password:{
            type:DataTypes.TEXT,
            allowNull: function() {
                return this.Google_ID ? true : false; // Rendre la colonne nullable si Google_ID est défini
            }
        },
        profil_picture : {
            type : DataTypes.TEXT,
        },
        cover_picture : {
            type : DataTypes.TEXT,
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
        tableName : "users",
    }
)


module.exports = userSchema;