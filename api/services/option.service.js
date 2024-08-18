const optionschema = require("../schemas/productOption.schema")
const subOptionSchema = require("../schemas/subOption.schema")

const findOptionByProduct = async(id) => {
    const response = await optionschema.findAll({where : {Id_product : id}})
    return response
}

const findOption = async(id) => {
    const response = await optionschema.findOne({where : {Id_product_option : id}})
    return response
}

const findOptionsAndSubOption = async(id)=>{
    const optionAndSubFinded = await optionschema.findAll({
        where : {Id_product_option : id},
        include: [{
            model: subOptionSchema, // Assurez-vous d'importer le modèle SubOption
            as: 'subOptions'  // Ceci devrait correspondre à l'alias défini dans l'association
        }]
    })
    return optionAndSubFinded
}

const createOption = async (req,productId)=> {
    try {
        const optionCreated = await optionschema.create({
            name : req.name,
            optionActive : req.optionActive,
            Id_product : productId,
            created_by : 'user',
        });
        return optionCreated
    } catch (error) {
        return error
    }
}


const updateOption = async (req) => {
    try {
     
        const optionUpdate = await optionschema.update({
            name : req.name,
            optionActive : req.optionActive,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_product_option : req.Id_product_option},
            returning: true,
            })
         return optionUpdate

    }catch (err){
        console.log(err)
        return err
    }
}

const deleteOption = async (id) => {
    try {
        const deleteAllSubOption = await subOptionSchema.destroy({
            where :{ 
                Id_product_option : id
            }
        })
        const optionDeleted = await optionschema.destroy({
            where : {
                Id_product_option : id
            }
        })
         return optionDeleted

    } catch (err){
        console.log(err)
        return err
    }
}

const createSubOption = async (req,option)=> {
    try {
        const subOptionCreated = await subOptionSchema.create({
            detail : req.detail,
            quantity_available : req.quantity_available,
            quantity_reservation : req.quantity_reservation,
            price : req.price,
            Id_product_option : option.Id_product_option,
            created_by : 'user',
        });
        return subOptionCreated
    } catch (error) {
        return error
    }
}

const updateSubOption = async (req,idsubOption) => {
    try {
        const suboptionUpdate = await subOptionSchema.update({
            detail : req.detail,
            quantity_available : req.quantity_available,
            quantity_reservation : req.quantity_reservation,
            price : req.price,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_subOption : idsubOption},
            returning: true,
            })
         return suboptionUpdate

    }catch (err){
        console.log(err)
        return err
    }
}

const deleteSubOption = async (id) => {
    try {
        const suboptionDeleted = await subOptionSchema.destroy({
            where : {
                Id_subOption : id
            }
        })
         return suboptionDeleted

    }catch (err){
        console.log(err)
        return err
    }
}

module.exports = {createOption,updateOption,deleteOption,findOptionsAndSubOption,createSubOption,updateSubOption,deleteSubOption,findOption,findOptionByProduct}
