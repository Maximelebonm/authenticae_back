const {Sequelize} = require('sequelize');
require('dotenv').config()

let db;
if(process.env.NODE_ENV === "development"){
    db = new Sequelize("authenticae","root","root",{
        host : "Localhost",
        dialect : "mysql",
        logging: function () {},
    })
}   
else {
    db = new Sequelize("ud5ut3pau6pdq8rd",process.env.DB_USER,process.env.DB_PASSWORD,{
        host : process.env.DB_HOST,
        dialect : "mysql",
        logging: function () {},
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
        dialectOptions: {
            socketPath: "/var/run/mysqld/mysqld.sock"
        },
    })
}

module.exports = db