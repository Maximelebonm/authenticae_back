const addressService = require('../services/address.service');

const findAddress = ()=> {

}

const createAddress = async (req,res)=> {
    try {
        const addressCreated = await addressService.createAdress(req,req.params.id)
        res.status(200).send({message : 'address created', data : addressCreated})
    } catch (error) {
        res.status(500).send({message : 'error', data : error})
    }
}

const deleteAddress = async (req,res)=> {
    try {
        const addressDeleted = await addressService.deleteAddress(req.params.id)
        if(addressDeleted[0] == 1)
            res.status(200).send({message : 'row deleted'})
    } catch (error) {
        res.status(500).send({message : 'error', data : error})
    }
}

const updateAdress = async (req,res)=> {
    try {
        const updatedAdress = await addressService.updateAddress(req)
        if(updatedAdress === "ok"){
            res.status(200).send({message : 'address updated'})
        }
    } catch (error) {
        res.status(500).send({message : 'erreur', data : error})
    }
}


module.exports = {createAddress,deleteAddress,updateAdress}