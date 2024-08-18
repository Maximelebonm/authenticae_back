const materialSchema = require('../schemas/material.schema')

const findAllMaterial = async (req,res) => {
    const MaterialsFinded = await materialSchema.findAll()
    return MaterialsFinded   
}

const findMaterial = async(id) => {
    const MaterialFinded = await materialSchema.findOne({where : {Id_material : id}})
    return MaterialFinded
}

module.exports = {findAllMaterial,findMaterial}