const roleSchema = require('../schemas/role.schema');
const user_role = require('../schemas/user_role.schema');
const userService = require('../services/user.service');

const findRoleByName = async (req)=>{
    try {
        const resp = await roleSchema.findOne({where : {name : req}})
        return resp    
    } catch (error) {
        return error
    }
}

const addRole = async(req,user)=>{
    try {
        const roleProducer = await findRoleByName(req.body.role)
        const roleAdd = await user.addRole(roleProducer,{ through: { created_by: 'admin', deleted_date : null, deleted_by : null }})
         return roleAdd
    } catch (error){
        return error
    }
}

const deleteRole = async(req,user)=>{
    try {
        const role = await findRoleByName(req.body.role)
        const userRole = await user_role.findOne({
            where : {
                Id_user : user.Id_user,
                Id_role : role.Id_role
            }
        })
        const roleDelete = await userRole.update({
            deleted_by : 'admin',
            deleted_date : Date.now()
        })
         return roleDelete
    }catch (error){
        console.log(error)
        return error
    }
}

module.exports = {findRoleByName, addRole, deleteRole}