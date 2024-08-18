const personalizationSchema = require('../schemas/personalization.schema')


const findPersonalization = async(id) => {
    const response = await personalizationSchema.findOne({where : {Id_personalization : id}})
    return response
}

const createPersonalisation = async (req,productId)=> {
    try {
        const personalizationnCreated = await personalizationSchema.create({
            name : req.name,
            detail : req.detail,
            price : req.price,
            personalizationActive : req.personalizationActive,
            Id_product : productId,
            created_by : 'user',
        });
        return personalizationnCreated
    } catch (error) {
        return error
    }
}

const updatePersonalization = async (req) => {
    try {
        const personalizationUpdate = await personalizationSchema.update({
            name : req.name,
            detail : req.detail,
            price : req.price,
            personalizationActive : req.personalizationActive,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_personalization : req.Id_personalization},
            returning: true,
            })
         return personalizationUpdate

    }catch (err){
        console.log(err)
        return err
    }
}

const deletePersonalization = async (id) => {
    try {
        const deletePersonalization = await personalizationSchema.destroy({
            where :{ 
                Id_personalization : id
            }
        })
        return deletePersonalization

    } catch (err){
        console.log(err)
        return err
    }
}

module.exports = {findPersonalization,createPersonalisation,updatePersonalization,deletePersonalization}