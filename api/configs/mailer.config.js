require('dotenv').config()

let mailerConfig;
if(process.env.NODE_ENV === "development"){
    mailerConfig = {
        host: "ethereal.risebuildings.com",
        port: 5587,
        secure : false,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.MAIL_TEST_USER,
            pass: process.env.MAIL_TEST_PASS,
        }
    }
}   
else {
    mailerConfig = {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure : true,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    }
}

module.exports = mailerConfig