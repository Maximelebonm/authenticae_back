let cookieConfig
let clearCookieConfig
if(process.env.NODE_ENV === "development"){
    cookieConfig ={
        sameSite:'none',
        secure : true,
        maxAge : 864000000,
    }
} else {
    cookieConfig ={
        domain: '.authenticae.fr',
        path: '/',
        sameSite:'none',
        secure : true,
        httpOnly: false,
        maxAge : 864000000,
    }
}

module.exports = {cookieConfig,clearCookieConfig}