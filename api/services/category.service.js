const categorySchema = require('../schemas/categoryProduct.schema');

const findAllCategoy = async () => {
    try {
        return await categorySchema.findAll()
    } catch (error) {
        return error
    }
}

const createCategory = async (req) => {
    try {
        return await categorySchema.create({
            name : req.name,
            created_by : 'admin'
        })
    } catch (error) {
        return error
    }
}

const updateCategory = async (req) => {
    try {
        return await categorySchema.update({
            name : req.body.name,
            updated_by : 'admin',
            updated_date : Date.now()
        },{
            where : {Id_categoryProduct : req.params.id}
        })
    } catch (error) {
        return error
    }
}

const deleteCategory = async (id) => {
    try {
        return await categorySchema.update({
            deleted_by : 'admin',
            deleted_date : Date.now()
        },{
            where : {Id_categoryProduct : id}
        });
    } catch (error) {
        return error
    };
}

module.exports = {findAllCategoy,createCategory,updateCategory,deleteCategory}