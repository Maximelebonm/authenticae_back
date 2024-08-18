const materialSchema = require('../schemas/material.schema');
const roleSchema = require('../schemas/role.schema');
const userController = require("../controllers/user.controller")
const roleInit= require('./role.script');
const materialInit= require('./material.script');
const categoryInit = require('./category.script')
const userService = require('../services/user.service')

require('dotenv').config()

const db = require('../configs/db.config')

const roleService = require('../services/role.service');
const categoryProductSchema = require('../schemas/categoryProduct.schema');

const adminUser = {
    body : {
        firstname : 'admin',
        lastname : 'admin',
        email : process.env.EMAIL,
        password : process.env.PASS,
        role : 'administrator',
    }
}

const initData = async ()=> {
    if (!adminUser.body.email || !adminUser.body.password) {
        throw new Error("Admin email or password not defined in environment variables");
    }
    try {
        await db.authenticate();
        await db.sync();
        
        const roles = await roleSchema.findAll()
        const materials =  await materialSchema.findAll()
        const categories = await categoryProductSchema.findAll()
      
        if(roles.length == 0 && materials.length == 0 && categories.length === 0){
         
                const roleInitialized =  await roleInit()
                const materialInitialized =  await materialInit()
                const categoryProdInitialized = await categoryInit()
            if((roleInitialized && materialInitialized && categoryProdInitialized)=== "OK"){
                const userCreated = await userController.registerFirstUser(adminUser)
                if(userCreated){
                    const user = await userService.findOneUserByID(userCreated.Id_user)
                    const addRole = await roleService.addRole(adminUser,user)
                    return 'db initialized , userAdmin created';
                } 
            } else {
                return "Initialization failed: roles, materials, or categories not created.";
            }
        } else {
           return "Database already initialized";
        }
    } catch (err) {
        return err
    }
}

module.exports = initData;