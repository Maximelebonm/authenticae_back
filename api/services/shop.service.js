const shopSchema = require('../schemas/shop.schema');
const productSchema = require('../schemas/product.schema');
const productImageschema = require('../schemas/product_image.schema');
const userSchema = require('../schemas/user.schema');

const findAllShop = async () => {
    try {
        const shopFinded = await shopSchema.findAll({
            where : {deleted_by : '0'},
            attributes : ['Id_shop','profil_picture','name','description']
        })
        return shopFinded   
    } catch (error) {
        return error
    }
}

const findShop = async(req) => {
    try {
        const shop = await shopSchema.findOne({where : {Id_user : req}, 
            include : [{
                model : userSchema,
                attributes: ['Id_user','Stripe_ID'], 
            },{
                model : productSchema,
                include : [{
                    model: productImageschema,
                    as: 'productImages',
               
                }]
            }]
        })
        return shop        
    } catch (error) {
        return error
    }
}

const findShopById = async(req) => {
    try {
        const shop = await shopSchema.findOne({
            where : {Id_shop : req},
            attributes : ['name','description','Id_shop','profil_picture','cover_picture'], 
            include : [{
                model : productSchema,
                attributes : ['Id_product','name'],
                include : [{
                    model: productImageschema,
                    as: 'productImages',
                    attributes : ['storage'],
                    where : {order : 0}
                }]
            }]
        })
        return shop
    } catch (error) {
        return error
    }
}

const createShop = async (req) => {
    try {
        const shopCreated = await shopSchema.create({
            name : req.body.name,
            description : req.body.description,
            Id_user : req.params.id,
            created_by : 'user',
        });
        return shopCreated
    } catch (error) {
        return error
    }
}

const imageShop = async (req) => {
    try {
        if(req.file.fieldname == 'avatar'){
            const imageUpdated = await shopSchema.update({
                profil_picture : req.file.path,
                updated_by : 'user',
                updated_date : Date.now()},
               {where : {Id_user : req.params.id},
            })
             return imageUpdated
        }
        else if (req.file.fieldname == 'cover'){
            const imageUpdated = await shopSchema.update({
                cover_picture : req.file.path,
                updated_by : 'user',
                updated_date : Date.now()},
               {
                where : {Id_user : req.params.id},
            })
             return imageUpdated
        }
    } catch (error) {
        return error
    }
}

const updateShop = async (req,res) => {
    try {
        const ShopUpdate = await shopSchema.update({
            name : req.body.name,
            description : req.body.description,
            phone : req.body.phone,
            social_media : req.body.social_media,
            updated_by : 'user',
            updated_date : Date.now()
        },{
            where : {Id_user : req.params.id},
        })
         return ShopUpdate

    }catch (err){
        return err
    }
}


const deleteShop = async(id) => {
    try {
        const ShopUpdate = await shopSchema.update({
            deleted_by : 'admin',
            deleted_date : Date.now()
        },{
            where : {Id_shop : id},
        })
         return ShopUpdate
    } catch (error) {
        return error
    }
}

const undeleteShop = async(id) => {
    try {
        const ShopUpdate = await shopSchema.update({
            deleted_by : 0,
            updated_date : Date.now(),
            updated_by : 'admin',
        },{
            where : {Id_shop : id},
        })
         return ShopUpdate
    } catch (error) {
        return error
    }
}

module.exports = {findAllShop,imageShop,findShop,createShop,updateShop,deleteShop,findShopById,undeleteShop}