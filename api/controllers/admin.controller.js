const roleService = require('../services/role.service');
const userService = require('../services/user.service');
const shopService = require('../services/shop.service');
const tvaService = require('../services/tva.service');
const categoryService = require('../services/category.service');
const materialService = require('../services/materials.service');

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

const getTVA = async(req,res)=>{
    try {
        const tva = await tvaService.getTVA()
        res.send(tva)
    } catch (error) {
        res.send(error)
    }
}

const updateTVA = async(req,res)=>{
    try {
        const tva = await tvaService.updateTVA(req)
        res.send(tva)
    } catch (error) {
        res.send(error)
    }
}

const addTVA = async(req,res)=>{
    try {
        const tva = await tvaService.addTVA(req.body)
        res.send(tva)
    } catch (error) {
        res.send(error)
    }
}

const deleteTVA = async(req,res)=>{
    try {
        const tva = await tvaService.deleteTVA(req.params.id)
        res.send(tva)
    } catch (error) {
        res.send(error)
    }
}

const getCategory = async(req,res)=>{
    try {
        const category = await categoryService.findAllCategoy()
        res.send(category)
    } catch (error) {   
        res.send(error)
    }
}

const updateCategory = async(req,res)=>{
    try {
        const category = await categoryService.updateCategory(req)
        res.send(category)
    } catch (error) {
        res.send(error)
    }
}

const addCategory = async(req,res)=>{
    try {
        const category = await categoryService.createCategory(req.body)
        res.send(category)
    } catch (error) {
        res.send(error)
    }
}

const deleteCategory = async(req,res)=>{
    try {
        const category = await categoryService.deleteCategory(req.params.id)
        res.send(category)
    } catch (error) {
        res.send(error)
    }
}

const getMaterial = async(req,res)=>{
    try {
        const material = await materialService.findAllMaterial()
        res.send(material)
    } catch (error) {
        res.send(error)
    }
}

const updateMaterial = async(req,res)=>{
    try {
        const material = await materialService.updateMaterial(req)
        res.send(material)
    } catch (error) {
        res.send(error)
    }
}

const addMaterial = async(req,res)=>{
    try {
        const material = await materialService.createMaterial(req.body)
        res.send(material)
    } catch (error) {
        res.send(error)
    }
}

const deleteMaterial = async(req,res)=>{
    try {
        const material = await materialService.deleteMaterial(req.params.id)
        res.send(material)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {addProducerRole,deleteProducerRole,deleteShop,undeleteShop,getTVA,updateTVA,addTVA,deleteTVA,getCategory,updateCategory,addCategory,deleteCategory,getMaterial,updateMaterial,addMaterial,deleteMaterial}
