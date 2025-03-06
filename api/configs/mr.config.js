require('dotenv').config()

let mrConfig = {}

if(process.env.NODE_ENV === "development"){
    mrConfig = {
        url : process.env.MR_API_URL_TEST,
        brand : process.env.MR_API_ID_BRAND_TEST,
        login : process.env.MR_API_LOGIN_TEST,
        pw : process.env.MR_API_PW_TEST,
    }
    } else {
        mrConfig = {
            url : process.env.MR_API_URL_PROD,
            brand : process.env.MR_API_ID_BRAND_PROD,
            login : process.env.MR_API_LOGIN_PROD,
            pw : process.env.MR_API_PW_PROD,
        }
    }

module.exports = mrConfig