const {Sequelize, DataTypes} = require('sequelize');
const db = require("../configs/db.config");

const user = require('./user.schema');
const role = require('./role.schema');

const user_roleSchema = db.define('user_role',{
    Id_user_role: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue : Sequelize.UUIDV4,
        unique : true,
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
    tableName : "user_role",
}
);

user.belongsToMany(role, {through : 'user_role', foreignKey: 'Id_user'})
role.belongsToMany(user, {through : 'user_role',foreignKey: 'Id_role'})

module.exports = user_roleSchema;