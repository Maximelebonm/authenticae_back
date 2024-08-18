const roleSchema = require('../schemas/role.schema');
const user_roleSchema = require('../schemas/user_role.schema');
const userSchema = require('../schemas/user.schema');
const addressschema = require('../schemas/adress.schema');
const userRoleService = require('./role.service');
const cartSchema = require('../schemas/cart.schema');
const shopSchema = require('../schemas/shop.schema')
const db = require('../configs/db.config');

const findAllUser = async ()=> {
    const userFinded = await userSchema.findAll( 
        {include: [{
            model: roleSchema,
            attributes: ['name'],
            through: {
                model: user_roleSchema, // Inclure la table d'association user_role
                attributes: [], // Exclure tous les attributs de la table d'association
                where: { deleted_date: null } // Ajouter une condition sur la colonne deleted_date
            } 
        }]}
    )
    return userFinded
}

const findOneUserByEmail = async (email) => {
    try {
        const user = await userSchema.findOne({
            where :  {email : email},
            include: [
                {
                model: roleSchema,
                attributes: ['name'],
                through: {
                    model: user_roleSchema, // Inclure la table d'association user_role
                    attributes: [], // Exclure tous les attributs de la table d'association
                    where: { deleted_date: null }
                }
                },
                {
                    model: addressschema,
                    where: { deleted_date: null },
                    required : false,
                },    
                {
                    model: cartSchema,
                    required : false,
                },
        ]
        })
        return user;
        
    } catch (error) {
        return error
    }
}

const findProducer = async (req) => {
    return await userSchema.findOne({where : {role : producer}})
}

const addStripeUser = async(req,stripeNewId)=> {
    try {
        const userUpdated = await userSchema.update({
            Stripe_ID : stripeNewId,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_user : req.params.id}
        })
        return userUpdated
    } catch (error) {
        return error
    }
}

const findOneGoogleUser = async(req)=>{
    try {
        if(req.provider){
            const userGoogleExist = await userSchema.findOne({where : {Google_ID : req.id}, attributes: { exclude: ['password'] }})
            if(userGoogleExist !== null){
                if(userGoogleExist){
                    return userGoogleExist
                }
                else {
                    const userUpdate = await userSchema.update({
                        Google_ID : req.id},
                        {
                        where : {email : req._json.email},
                        })
                }
                const userGoogleUpdated= await userSchema.findOne({where : {email : req._json.email}, attributes: { exclude: ['password'] }})
                return userGoogleUpdated
            } else {
                return "user doesnt exist"
            }
        }
    } catch (error) {
        return error
    }
}

const addGoogleId = async (user,googleId)=> {
    try {
        const userUpdated = await userSchema.update({
            Google_ID : googleId,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_user : user.Id_user}
        })
        return userUpdated
    } catch (error) {
        return error
    }
}

const findOneUserByID = async (id) => {
    try {
        const user = await userSchema.findOne(
            {where : {Id_user : id},
            attributes: { exclude: ['password'] },
            include: [
                {
                model: roleSchema,
                attributes: ['name'],
                through: {
                    model: user_roleSchema, // Inclure la table d'association user_role
                    attributes: [], // Exclure tous les attributs de la table d'association
                    where: { deleted_date: null } // Ajouter une condition sur la colonne deleted_date
                }
                },
                {
                    model: addressschema,
                    where: { deleted_date: null },
                    required : false,
                },    
                {
                    model: cartSchema,
                    where: { cart_state : 'active' },
                    required : false,
                },
                {
                    model: shopSchema,
                    required : false,
                }      
        ]})
            return user
    } catch (error) {
        return error
    }
}


const createUser = async (req,password) => {
    try {
        const t = await db.transaction();
        let userCreatedPromise
        if(req.provider){
            userCreatedPromise = await userSchema.create({
                lastname : req._json.family_name,
                firstname : req._json.given_name,
                email : req._json.email,
                Google_ID : req.id,
                created_by : 'google'
             },{ transaction: t });
        } else {
            userCreatedPromise = await userSchema.create({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                birthdate : req.body.birthdate,
                email : req.body.email,
                phone : req.body.phone,
                password : password,
                profil_picture : req.body.profil_picture,
                cover_picture : req.body.cover_picture,
                created_by : 'user',
             },{ transaction: t });
        }
    
        const findRole = await userRoleService.findRoleByName('client'); 
        const userFull = await userCreatedPromise.addRole(findRole,{ through: { created_by: 'user' },transaction: t});

        
        const createCartPromise = await cartSchema.create({
            cart_state : "active",
            price : 0,
            Id_user : userCreatedPromise.Id_user,
            created_by : 'user',
        }, { transaction: t })
        
        await Promise.all([userFull,userCreatedPromise,createCartPromise])


        await t.commit();

        const findUser = findOneUserByID(userCreatedPromise.Id_user)
        return findUser;
    } catch (error) {
        await t.rollback();
        return error
    }
}

const createPseudo = async (req) => {
    const user = await findOneUserByID(req.params.id)
    if(user.identifiant){
        return user
    }
    const pseudoCreated = await userSchema.update({
        identifiant : req.body.pseudo,
        updated_by : 'user',
        updated_date : Date.now()},
        {where : {Id_user : req.params.id},
    })
    return pseudoCreated;
}

const updateUser = async (req) => {
    try {
        const userUpdated = await userSchema.update({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            birthdate : req.body.birthdate,
            phone : req.body.phone,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_user : req.params.id},
            returning: true,
            })
        return userUpdated
    } catch (error) {
        return error
    }

}

module.exports = {
    createPseudo,
    findOneGoogleUser,
    findAllUser,
    findOneUserByEmail,
    findProducer,
    createUser,
    findOneUserByID,
    updateUser,
    addStripeUser,
    addGoogleId
}