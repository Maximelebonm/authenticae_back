let cookieConfig
if(process.env.NODE_ENV === "development"){
    cookieConfig = {
        sameSite:'none',
        secure : true,
        maxAge : 604800000,
    }
} else {
    cookieConfig ={
        domain: '.authenticae.fr',
        path: '/',
        sameSite:'none',
        secure : true,
        httpOnly: false,
        maxAge : 604800000,
    }
}

module.exports = cookieConfig