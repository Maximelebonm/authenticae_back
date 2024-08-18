const stripe = require('stripe');
require('dotenv').config();

let stripeClient;

if (process.env.NODE_ENV === 'development') {
    stripeClient = stripe(process.env.STRIPE_TEST_SECRET);
} else {
    stripeClient = stripe(process.env.STRIPE_SECRET);
}

module.exports = stripeClient;