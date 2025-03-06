const materialSchema = require('../schemas/material.schema');

const findAllMaterial = async () => {
    try {
        return await materialSchema.findAll()
    } catch (error) {
        return error
    }
}

const createMaterial = async (req) => {
    try {
        return await materialSchema.create({
            name : req.name,
            created_by : 'admin'
        })
    } catch (error) {
        return error
    }
}

const updateMaterial = async (req) => {
    try {
        return await materialSchema.update({
            name : req.body.name,
            updated_by : 'admin',
            updated_date : Date.now()
        },{
            where : {Id_material : req.params.id}
        })
    } catch (error) {
        return error
    }
}

const deleteMaterial = async (id) => {
    try {
        return await materialSchema.update({
            deleted_by : 'admin',
            deleted_date : Date.now()
        },{
            where : {Id_material : id}
        });
    } catch (error) {
        return error
    };
}

module.exports = {findAllMaterial,createMaterial,updateMaterial,deleteMaterial}