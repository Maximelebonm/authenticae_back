const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userService = require('../services/user.service');
const { decodeToken } = require('../security/auth.security');
require('dotenv').config()

const parseCookies = (cookieHeader) => {
    const cookies = {};
    cookieHeader.split('; ').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      cookies[name.trim()] = rest.join('=').trim();
    });
    return cookies;
  };

const protect = asyncHandler(
    async (req,res,next) => {
        const cookieauth = parseCookies(req.headers.cookie)
        let token;
        if(req.headers.cookie && cookieauth.auth){
            try {
                /* 
                    prendre de le jeton et le diviser en un tableau
                    le 2eme element est le jeton
                */
                const cookies = parseCookies(req.headers.cookie);
                token = cookies.auth;
        
                const decoded = decodeToken(token);
                /* 
                    trouver l'utilisateur par l'ID puis prendre les infos sauf
                    le mot de passe.
                */
               if(decoded){
                   const user = await userService.findOneUserByID(decoded.Id_user);
                   if(user)
                   next();
               }
               else {
                    res.status(401).send({message : "Vous n'êtes pas autorisé à faire cela"})
               }
            } catch (err) {
                console.error(err);
                res.status(401).send({message : "Vous n'êtes pas autorisé à faire cela"})
                //.send({message : err})
                throw new Error("non autorisé, token échoué")
            }
        } else if(!token){
            res.status(401).send({message : "vous n'êtes pas autorisé à faire cela"})
            throw new Error("pas autorisé , pas de token")
        }
    }
)

module.exports = protect