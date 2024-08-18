const shopService = require('../services/shop.service');
const express = require('express');
const path = require('path');

const findAllShop = async (req,res) => {
    try {
        const request = await shopService.findAllShop()
        res.status(200).send({data : request, fileDest : express.static(path.join(__dirname, '../../../storage'))})
    } catch (err) {
        res.status(404).send(err)
    }
}

const findShopById = async (req,res) => {
    try {
        const response = await shopService.findShopById(req.params.id)
    if(response){
            res.status(200).send({message : "shop exist", data : response})
        }
        else {
            res.send({message : "shop unexist", data : response})
        }
    } catch (err) {
        res.send(err)
    }
}

const findShop = async (req,res) => {
    try {
        const response = await shopService.findShop(req.params.id)
    if(response){
            res.status(200).send({message : "shop exist", data : response})
        }
        else {
            res.send({message : "shop unexist", data : response})
        }
    } catch (err) {
        res.send(err)
    }
}

const createShop = async (req,res) => {
    try {
        const shopExist = await shopService.findShop(req.params.id)
        if(shopExist){
            res.status(500).send({message : 'le shop éxiste déjà'})
        }
        else{
            const createShop = await shopService.createShop(req)
            res.status(200).send({message : 'shop created', data : createShop})
        }
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const imageShop = async(req,res)=>{
    try {
        const request = await shopService.imageShop(req)
        res.status(200).send(request)
    } catch (err) {
        res.status(404).send(err)
    }
}

const updateShop = async (req,res) => {
    try {
        const request = await shopService.updateShop(req)
        res.status(200).send({message : "shop updated", data : request})
    } catch (err) {
        res.status(404).send(err)
    }
}

const deleteShop = (req,res) => {

}

module.exports = {findAllShop,imageShop,findShop,createShop,updateShop,deleteShop,findShopById}