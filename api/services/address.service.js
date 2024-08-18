const adressSchema = require('../schemas/adress.schema')

const findAddress = async(id) => {
    const response = await adressSchema.findOne({where : {Id_address : id}})
    return response
}



const createAdress = async (req, id)=> {
    try {
        const addressCreated = await adressSchema.create({
            country : req.body.country,
            city : req.body.city,
            cityCode : req.body.cityCode,
            number : req.body.number,
            street : req.body.street,
            additional : req.body.additional,
            Id_user : id,
            created_by : 'user',
        });
        return addressCreated
    } catch (error) {
        return error
    }
}

const updateAddress = async (req)=> {
    try {
        const addressCreated = await adressSchema.update({
            country : req.body.country,
            city : req.body.city,
            cityCode : req.body.cityCode,
            number : req.body.number,
            street : req.body.street,
            additional : req.body.additional,
            created_by : 'user',
        }, {where : {Id_address : req.body.Id_address}});
        return 'ok'
    } catch (error) {
        return error
    }
}

const deleteAddress = async (id)=> {
    try {
        return await adressSchema.update({
            deleted_by : 'user',
            deleted_date : Date.now(),
        },{
            where : {Id_address : id}
        });
    } catch (error) {
        return error
    }
}

module.exports = {findAddress,createAdress,deleteAddress,updateAddress}