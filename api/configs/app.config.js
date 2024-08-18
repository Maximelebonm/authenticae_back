require('dotenv').config()

let config
if(process.env.NODE_ENV === "development"){
    config = {
        PORT : 4000,
        origin : "http://localhost:5173",
        methods : "GET,POST,PUT,DELETE",
        credentials : true,
    }
} else {
    config = {
    origin : process.env.ORIGIN_PROD,
    credentials : true,
    methods : "GET,POST,PUT,DELETE",
    }
}



module.exports= config