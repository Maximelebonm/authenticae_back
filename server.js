const express = require('express');
const cors = require('cors');
require('dotenv').config()
const db = require('./api/configs/db.config');
const config = require('./api/configs/app.config')
const schemas = require('./api/schemas/index.schema');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(cors(config));

app.use("/storage", express.static(path.join(__dirname, './storage')));
app.use("/documents", express.static(path.join(__dirname, './documents')));

app.use(session({
    secret: process.env.COOKIES_SECRET,
    resave: true,
    saveUninitialized : true,
    cookie: { secure: true },
}))



app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser((user, done)=>{
    done(null,user)
})

passport.deserializeUser((user, done)=>{
    done(null,user)
})

console.log(process.env.PORT)


app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 5000

const routes = require('./api/routes/index.router');
const script = require('./api/script/index.script');
script()

app.use(routes)

app.listen(port, () => 
    {  console.log("Serveur à l'écoute au port : " , port)
})

