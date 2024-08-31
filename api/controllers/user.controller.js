const userService = require('../services/user.service');
const security = require('../security/auth.security');
const config = require('../configs/app.config');
const mailService = require('../services/mail.service');
const cookieConfig = require('../configs/cookie.config')

const findAllUser = async (req,res) => {
    try {
        const request = await userService.findAllUser()
        res.status(200).send(request)
    } catch (err) {
        res.status(404).send(err)
    }
}

const findUserByEmail = async (req,res) => {
    try {
        const request = await userService.findOneUserByEmail(req.email)
        return request
    } catch (err) {
        return err
    }
}

const createPseudo = async (req,res) => {
    try {
        const request = await userService.createPseudo(req)
        const findNewUser = await userService.findOneUserByID(req.params.id)
        const accessToken = security.jwtsecurity(findNewUser)
        res.clearCookie('auth');
        res.cookie('auth', accessToken,{
            domain: '.authenticae.fr',
            path: '/',
            sameSite:'none',
            secure : true,
            httpOnly: false,
            maxAge : 864000000,
        }).send({message : 'pseudo created'})
    } catch (err) {
        return err
    }
}

const findUserByID = async (req,res)=>{
    try {
        if(req.user){
            const findUser = await userService.findOneUserByID(req.user.Id_user)
            return findUser
        } else {
            const response = await userService.findOneUserByID(req.params.id)
            if(response){
                res.status(200).send(response)
            } else {
                res.status(404).send({message : "utilisateur n'existe pas", data : response})
            }
        }
    } catch (err) {
        res.status(500).send({message : 'une erreur est survenue', data : err})
    }
}


const emailValidation = async(req,res)=>{
    try {
        const userExist = await userService.findOneUserByEmail(req.body.email)
        if(userExist){
            res.send({message : 'email exist'})
        } else {
            const token = security.jwtsecurityValidEmail(req.body)
            const validationEmail = await mailService.mailvalidation(req,token)
            console.log(validationEmail)
            res.send({message : 'email envoyé'})
        }
    } catch (error) {
        res.send({message : 'une erreur est survenu'})
    }

}

const loginUser = async (req,res) => {
    try {
        console.log(req.body.email)
        const findUser = await userService.findOneUserByEmail(req.body.email);
        if(findUser){
            const comparePassword = await security.comparePassword(req.body.password,findUser.password);
            if(comparePassword){
                const accessToken = security.jwtsecurity(findUser)
                // console.log('findUser : ', findUser)
                // console.log('accessToken : ', accessToken)
                res.cookie('auth', accessToken,{
                    domain: '.authenticae.fr',
                    path: '/',
                    sameSite:'none',
                    secure : true,
                    httpOnly: false,
                    maxAge : 864000000,
                })
                res.status(200).send({message : 'connection autorisé'});
            }
            else {
                res.status(200).send({message : 'mot de passe incorrect'});
            }
        }
        else {
            res.status(200).send({message : 'email invalide'});
        }
    } catch (err) {
        res.status(404).send(err);
    }
}

const registerUser = async (req,res) => {
    try {
        const password = await security.hashPassword(req.body.password);
        const request = await userService.createUser(req,password);
        res.status(200).send({message : 'user created'});
    } catch (err) {
        res.status(404).send(err);
    }
}

const registerFirstUser = async (req,res) => {
    try {
        const password = await security.hashPassword(req.body.password);
        const request = await userService.createUser(req,password);
        return request;
    } catch (err) {
        return err;
    }
}

const addstripeUser = async(req,res,Stripe_ID)=>{
    try {
        const findUser = await userService.findOneUserByID(req.params.id)
        if(findUser.Id_user === req.params.id){
            const request = await userService.addStripeUser(req,Stripe_ID);
            return await userService.findOneUserByID(req.params.id)
        } else {
            return "user don't exist"
        }
    } catch (err) {
        return err
    }
}

const updateUser = async (req, res) => {
    try {
        const findUser = await userService.findOneUserByID(req.params.id)
        if(findUser.Id_user === req.params.id){
            const request = await userService.updateUser(req);
            const userUpdated = await userService.findOneUserByID(req.params.id)
            res.status(200).send({message : 'user updated', data : userUpdated})
        } else {
           res.status(200).send({message : "user don't exist"})
        }
    } catch (err) {
        res.status(404).send(err)
    }
}


const logoutUser = async (req, res) => {
    try {
        res.send({message : 'deconnexion OK'})
    } catch (err) {
        res.status(404).send(err)
    }
}

const checkGoogleUser = async (req, res)=> {
    try{
    const userExist = await userService.findOneUserByEmail(req.emails[0].value);
    if(userExist.Google_ID){
        return userExist 
    } 
    else if (userExist.email){
        const userGoogle = await userService.addGoogleId(userExist,req.id);
        const userUpdated = await userService.findOneUserByID(userExist.Id_user)
        return userGoogle
    }
    else {
        const registerGoogleUser = await userService.createUser(req)
        return registerGoogleUser      
    } 
    } catch (err){
       return err
    }
}

module.exports = {findAllUser,registerFirstUser,emailValidation,createPseudo,findUserByID,findUserByEmail,registerUser, updateUser,loginUser, checkGoogleUser,logoutUser, addstripeUser}