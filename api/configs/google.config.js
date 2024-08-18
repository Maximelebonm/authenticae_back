const stripe = require('stripe');
require('dotenv').config();

let googleConfig;

if (process.env.NODE_ENV === 'development') {
    googleConfig = process.env.GOOGLE_REDIRECT_DEV
} else if(process.env.NODE_ENV === 'production'){
    googleConfig = process.env.GOOGLE_REDIRECT
}

module.exports = googleConfig;