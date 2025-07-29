const addressService = require('../services/address.service');
const security = require('../security/auth.security');
const cookieConfig = require('../configs/cookie.config');
const useService = require('../services/user.service');

const findAddress = ()=> {

}

const createAddress = async (req,res)=> {
    try {
        const addressCreated = await addressService.createAdress(req,req.params.id)
        const findUser = await useService.findOneUserByID(req.user.Id_user)
        const accessToken = security.jwtsecurity(findUser)
        res.clearCookie('auth');
        res.cookie('auth', accessToken,cookieConfig)
        res.status(200).send({message : 'address created', data : addressCreated})
    } catch (error) {
        res.status(500).send({message : 'error', data : error})
    }
}

const deleteAddress = async (req,res)=> {
    try {
        const addressDeleted = await addressService.deleteAddress(req.params.id)
        if(addressDeleted[0] == 1){
            const findUser = await useService.findOneUserByID(req.user.Id_user)
            const accessToken = security.jwtsecurity(findUser)
            res.clearCookie('auth');
            res.cookie('auth', accessToken,cookieConfig)
            res.status(200).send({message : 'row deleted'})
        }
    } catch (error) {
        res.status(500).send({message : 'error', data : error})
    }
}

const updateAdress = async (req,res)=> {
    try {
        const updatedAdress = await addressService.updateAddress(req)
        if(updatedAdress === "ok"){
            const findUser = await useService.findOneUserByID(req.user.Id_user)
            const accessToken = security.jwtsecurity(findUser)
            res.clearCookie('auth');
            res.cookie('auth', accessToken,cookieConfig)
            res.status(200).send({message : 'address updated'})
        }
    } catch (error) {
        res.status(500).send({message : 'erreur', data : error})
    }
}

module.exports = {createAddress,deleteAddress,updateAdress}