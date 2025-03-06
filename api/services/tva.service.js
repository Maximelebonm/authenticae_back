const { or } = require('sequelize');
const tvaSchema = require('../schemas/tva.schema');

const getTVA = async() => {
    try {
        return await tvaSchema.findAll(
            {order : [['tva_rate','ASC']]}
        )
    } catch (error) {
        return error
    }
}

const updateTVA = async(req) => {
    try {
        return await tvaSchema.update({
            name : req.body.name,
            tva_rate : req.body.tva_rate,
            updated_by : 'admin',
            updated_date : Date.now()
        },{
            where : {Id_tva : req.params.id}
        })
    } catch (error) {
        return error
    }
}

const addTVA = async(req) => {
    try {
        return await tvaSchema.create({
            name : req.name,
            tva_rate : req.tva_rate,
            created_by : "admin"
        })
    } catch (error) {
        return error
    }
}

const deleteTVA = async(req) => {
    try {
        return await tvaSchema.update({
            deleted_by : 'admin',
            deleted_date : Date.now()
        },{
            where : {Id_tva : req}
        })
    } catch (error) {
        return error
    }
}

module.exports = {getTVA,updateTVA,addTVA,deleteTVA}