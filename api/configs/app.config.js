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
    PORT : process.env.PORT || 5000,
    origin : process.env.ORIGIN_PROD,
    credentials : true,
    // SSL: true, 
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    methods : "GET,POST,PUT,DELETE",
    // SSL_KEY: process.env.SSL_KEY || '/etc/letsencrypt/live/authenticae.fr/privkey.pem',
    // SSL_CERT: process.env.SSL_CERT || '/etc/letsencrypt/live/authenticae.fr/fullchain.pem'
    }
}



module.exports= config