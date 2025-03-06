let clearCookieConfig
if(process.env.NODE_ENV === "development"){
    clearCookieConfig = {
        sameSite:'none',
        secure : true,
        maxAge : 0,
    }
} else {
    clearCookieConfig ={
        domain: '.authenticae.fr',
        path: '/',
        sameSite:'none',
        secure : true,
        httpOnly: false,
        maxAge : 0,
    }
}

module.exports = clearCookieConfig