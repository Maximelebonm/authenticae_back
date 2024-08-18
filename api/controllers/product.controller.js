const productService = require('../services/product.service');
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const productImagesSchema = require('../schemas/product_image.schema');


const findAllProducts = async (req,res) => {
    try {
        const request = await productService.findAllProducts()
        res.status(200).send({message :  'products geted',data : request, fileDest : express.static(path.join(__dirname, '../../../storage'))})
    } catch (err) {
        res.status(404).send(err)
    }
}
const checkUploadPictures = async (req,res)=> {
    const findProductImages = await productImagesSchema.count({where : {Id_product : req.params.id, archived : 0}})
    const CountRest = 8 - findProductImages - req.body.numberOfUpload
    if(CountRest >= 0){
        res.status(200).send({message : "upload autorisé"})
    } 
    else {
        res.status(200).send({message : "upload non autorisé"})
    }
}
const findProduct = async(req, res)=>{
    try {
        const findProduct = await productService.findProduct(req.params.id)
        res.status(200).send({message : 'product geted', data : findProduct})
     
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}
const downPicture = async(req,res)=>{
    try {
        const downpictureProduct = await productService.downPicture(req)
        if(downpictureProduct === "ok"){
            res.status(200).send({message : "image down"})
        }
        else {
            res.status(200).send({message : "probleme"})   
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const upPicture = async(req,res)=>{
    try {
        const downpictureProduct = await productService.upPicture(req)
        if(downpictureProduct === "ok"){
            res.status(200).send({message : "image up"})
        }
        else {
            res.status(200).send({message : "probleme"})   
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const picturesProduct = async (req,res)=> {
    try {
        const pictureProduct = await productService.picturesProduct(req)
        if(pictureProduct === "trop d'images"){
            res.status(200).send({message : "trop d'image", data : "none"})
        }
        if(pictureProduct === 'ok'){
            const findPictureByOrder = await productImagesSchema.findAll({where :{ Id_product : req.params.id}},{order : [['order', 'ASC']]})
            res.status(200).send({message : 'product created', data : findPictureByOrder})
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const deletePicture = async (req,res)=> {
    try {
        const filename = req.body.name;
        const folder = req.body.Id_user
        const filePath = path.join(__dirname, `../../storage/${folder}`, filename);

        console.log('Trying to delete file at path:', filePath);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression du fichier:', err);
                return res.status(500).send('Erreur lors de la suppression du fichier');
            }
        });

        const deleteProduct = await productService.deletePicture(req)
        if(deleteProduct == 1){
            res.status(200).send({message : 'image deleted'})
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const archivePicture = async (req,res)=> {
    try {
        const pictureArchive = await productService.archivePicture(req)
        if(pictureArchive === 'ok'){
            res.status(200).send({message : 'archived'})
        }
        }
    catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const updateProduct = async (req,res)=> {
    try {
        const updateProduct = await productService.updateProduct(req)
        if(updateProduct){
            const updatedProduct = await productService.findProduct(req.params.id)
            res.status(200).send({message : 'product updated', data : updatedProduct,fileDest : express.static(path.join(__dirname, '../../../storage'))})
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const createProduct = async (req,res)=> {
    try {
        const createProduct = await productService.createProduct(req)
        res.status(200).send({message : 'product created', data : createProduct})
     
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const deleteProduct = async (req,res)=> {
    try {
        const deleteProduct = await productService.deletedProduct(req.params.id)
        if(deleteProduct){
            res.status(200).send({message : 'product deleted'})
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}


module.exports = {createProduct,deleteProduct,findProduct,findAllProducts,upPicture,picturesProduct,archivePicture,updateProduct,deletePicture,checkUploadPictures,downPicture}