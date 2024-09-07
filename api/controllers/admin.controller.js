const roleService = require('../services/role.service')
const userService = require('../services/user.service')
const shopService = require('../services/shop.service')

const addProducerRole = async(req,res)=>{ 
    try {
        const user = await userService.findOneUserByID(req.params.id)
        const addRole = await roleService.addRole(req,user)
        res.send('add role success')
    } catch (error) {
        res.send(error)
    }
}

const deleteProducerRole = async(req,res)=>{ 
    try {
        const user = await userService.findOneUserByID(req.params.id)
        const addRole = await roleService.deleteRole(req,user)
        res.send('delete role success')
        
    } catch (error) {
        res.send(error)
    }
}



const deleteShop = async(req,res)=>{ 
    try {
        const deleteShop = await shopService.deleteShop(req.params.id)
        res.send({message : 'shop désactivé'})
    } catch (error) {
        res.send(error)
    }
}

const undeleteShop = async(req,res)=>{ 
    try {
        const deleteShop = await shopService.undeleteShop(req.params.id)
        res.send({message : 'shop activé'})
    } catch (error) {
        res.send(error)
    }
}

module.exports = {addProducerRole,deleteProducerRole,deleteShop,undeleteShop}