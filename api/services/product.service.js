const productSchema = require('../schemas/product.schema');
const matrialSchema = require('../schemas/material.schema');
const optionsSchema = require('../schemas/productOption.schema')
const subOptionSchema = require('../schemas/subOption.schema')
const personalizationSchema = require('../schemas/personalization.schema')
const optionService = require('./option.service');
const personalizationService = require('./personalization.service')
const productImagesSchema = require('../schemas/product_image.schema');
const {Sequelize, Op} = require('sequelize');

const findAllProducts = async () => {
    try {
        const productsFinded = await productSchema.findAll({where : {deleted_by : '0'},
        attributes: ['Id_product','name','price','description'],
        include: {
            model: productImagesSchema,
            attributes: ['storage'],
            as: 'productImages',
            required : false,
            where: {
                order: 0,
                archived : false,
            },
        }})
        return productsFinded   
        
    } catch (error) {
        return error
    }
}

const findProduct = async(id) => {
    try {
    const product = await productSchema.findOne({where : {Id_product : id}})
    const option = await optionsSchema.findAll({
        where : {Id_product : id, deleted_by : 0},
        include: [{
            model: subOptionSchema,
            as: 'subOptions'
        }]
    })
    const personalization = await personalizationSchema.findAll({
        where : {Id_product : id}
    })
    const productImage = await productImagesSchema.findAll({
        where: {
          Id_product: id,
          archived: 0
        },
        order: [['order', 'ASC']]
      })

    const response = {product : product,option :option, personalization : personalization, images : productImage}
    return response
    } catch (error) {
        return error
    }
}

const findProductByShop = async(req) => {
    try {
        const response = await productSchema.findAll({where : {Id_shop : req.body.Id_shop}})
        return response
    } catch (error) {
        return error
    }
}

const createProduct = async (req)=> {
    try {
        const productCreated = await productSchema.create({
            name : req.body.name,
            description : req.body.description,
            Id_user : req.body.Id_user,
            Id_shop : req.body.Id_shop,
            created_by : 'user',
        });
        return productCreated
    } catch (error) {
        return error
    }
}

const picturesProduct = async (req,res)=> {
    try {
        const tabFile = req.files;
        const pictureOfProduct = await productImagesSchema.findAndCountAll({where : {Id_product : req.params.id , archived : 0}})
        let countPictures = pictureOfProduct.count
            if(pictureOfProduct.count < 8){
                tabFile.forEach(async (item,index)=>{
                        return await productImagesSchema.create({
                            storage : item.path,
                            name : item.filename,
                            archived : 0,
                            created_by : 'user',
                            order : countPictures + index,
                            Id_product : req.params.id
                        });
                    })
                return "ok"
            } else {  
                return "trop d'images"
            }
        }
    catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const archivePicture = async (req)=>{
    try {
        const imageToArchive = await productImagesSchema.findOne({
            where: { Id_product_image: req.params.id }
        });
        const pictureArchiv = await productImagesSchema.update({
            archived : 1},
            {
                where : {Id_product_image : req.params.id},
            })
            const order = imageToArchive.order;
        const updateOrder = await productImagesSchema.update(
            { order: Sequelize.literal('`order` - 1') },
            {
                where: {
                Id_product: req.body.Id_product,
                order: {
                    [Op.gt]: order
                }
                }
            }
            );
            if(updateOrder){
                return 'ok'
            }
    } catch (error) {
        return error
    }
}

const deletePicture = async (req)=>{
    try {
        const imageToDelete = await productImagesSchema.findOne({
            where: { Id_product_image: req.params.id }
        });
            const productImagedelete = await productImagesSchema.destroy({where : {Id_product_image : req.params.id}})
            const order = imageToDelete.order;
            const updateOrder = await productImagesSchema.update(
                { order: Sequelize.literal('`order` - 1') },
                {
                  where: {
                    Id_product: req.body.Id_product,
                    order: {
                      [Op.gt]: order
                    }
                  }
                }
              );
            return productImagedelete
        }catch (err){
            console.log(err)
            return err
        }
}

const downPicture = async(req)=> {
    try {
        const orderToUp = req.body.order + 1
        const findImageToDown = await productImagesSchema.findOne({
            where: {
              Id_product: req.body.Id_product,
              order: orderToUp,
              archived: 0
            },
        })
            const productImagedown = await productImagesSchema.update({
                order : orderToUp},
                {
                    where : {Id_product_image : req.params.id},
                })
                if(productImagedown){
                    const productImageup = await productImagesSchema.update(
                        { order: req.body.order },
                        {
                            where : {Id_product_image : findImageToDown.Id_product_image},
                        });
                    return 'ok'
                }
        }catch (err){
            console.log(err)
            return err
        }
}

const upPicture = async(req)=> {
    try {
        const orderToUp = req.body.order - 1
        const findImageToUp = await productImagesSchema.findOne({
            where: {
              Id_product: req.body.Id_product,
              order: orderToUp,
              archived: 0
            },
        })
            const productImagedown = await productImagesSchema.update({
                order : orderToUp},
                {
                    where : {Id_product_image : req.params.id},
                })
                if(productImagedown){
                    const productImageup = await productImagesSchema.update(
                        { order: req.body.order },
                        {
                            where : {Id_product_image : findImageToUp.Id_product_image},
                        });
                    return 'ok'
                }
        }catch (err){
            console.log(err)
            return err
        }
}

const updateProduct = async (req,res) => {
    try {
        const productUpdate = await productSchema.update({
            name : req.body.name,
            description : req.body.description,
            detail : req.body.specification,
            price : req.body.price,
            quantity_available : req.body.quantity_available,
            on_command : req.body.on_command,
            working_days : req.body.productWorkingDays,
            quantity_reservation : req.body.quantity_reservation,
            Id_material : req.body.Id_material,
            updated_by : 'user',
            updated_date : Date.now()},
            {
            where : {Id_product : req.params.id},
            })

            if(req.body.options){
                const backOptions = await optionsSchema.findAll({
                    where : {Id_product : req.params.id},
                    include: [{
                        model: subOptionSchema,
                        as: 'subOptions'
                    }]
                })
                
                const optionTab = req.body.options

                if(backOptions?.length === 0){ // test avec le point d'interogation ?? "pas d'option"  donne l'attribut après les 2 point d'interogation
                    optionTab.forEach(async(item)=>{
                        const createOption = await optionService.createOption(item,req.params.id)
                        item.subOptions.forEach(async(subItem)=>{
                            const createdSuboption = await optionService.createSubOption(subItem,createOption)
                        })
                    })
                }
                else {
                    optionTab.forEach(async(frontItem)=>{
                        const existingOption = backOptions.find((backOptionItem)=> backOptionItem.Id_product_option === frontItem.Id_product_option)                      
                            if(existingOption){
                                    const updateOption = await optionService.updateOption(frontItem)
                                    frontItem.subOptions.forEach( async(FrontSubItem)=>{
                                        const existIngSubOption = existingOption.subOptions.find((backSubItem)=> backSubItem.Id_subOption === FrontSubItem.Id_subOption)    
                                            if(existIngSubOption){
                                                const updateSuboption = await  optionService.updateSubOption(FrontSubItem,FrontSubItem.Id_subOption)
                                            }
                                            else{
                                                const createSubOption = await optionService.createSubOption(FrontSubItem,existingOption)
                                            }
                                    })                           
                            }
                            else{
                                    const createOption = await optionService.createOption(frontItem,req.params.id)
                                    frontItem.subOptions.forEach(async(subItem)=>{
                                        const createdSuboption = await optionService.createSubOption(subItem,createOption)
                                    })
                
                            }
    
                        })
                }
            }

            if(req.body.personalization){
                const backPersonalization = await personalizationSchema.findAll({
                    where : {Id_product : req.params.id},
                })
                const personalizationTab = req.body.personalization
                if(backPersonalization.length === 0){
                    personalizationTab.forEach(async(item)=>{
                        const createPersonalisation = await personalizationService.createPersonalisation(item,req.params.id)
                    })
                }
                else {
                    personalizationTab.forEach(async(frontItem)=>{
                        const existingPersonalization = backPersonalization.find((backPersonalizationItem)=> backPersonalizationItem.Id_personalization === frontItem.Id_personalization)                      
                            if(existingPersonalization){
                                    const updateOption = await personalizationService.updatePersonalization(frontItem)                                 
                            }
                    })
                }
            }
            return productUpdate
    } catch (err){
        return err
    }
}

const deletedProduct = async (req,res) => {
    try {
        const productdelete = await productSchema.update({
            deleted_by : 'user',
            deleted_date : Date.now()},
            { 
                where : {Id_product : req}
            })
        
         return productdelete

    }catch (err){
        return err
    }
}

module.exports = {createProduct,updateProduct,upPicture,deletedProduct,findProduct,downPicture,findProductByShop,findAllProducts,picturesProduct,archivePicture,deletePicture}