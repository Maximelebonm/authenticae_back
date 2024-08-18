const materialService = require('../services/material.service');
const express = require('express');
const path = require('path');

const findAllMaterials = async (req,res) => {
    try {
        const findMaterials = await materialService.findAllMaterial(req)
        res.status(200).send({message :  'materials geted',data : findMaterials, fileDest : express.static(path.join(__dirname, '../../../storage'))})
    } catch (err) {
        res.status(404).send(err)
    }
}

const findMaterial = async(req, res)=>{
    try {
        const findMaterial = await materialService.findMaterial(req.params.id)
        res.status(200).send({message : 'materials geted', data : findMaterial, fileDest : express.static(path.join(__dirname, '../../../storage'))})
     
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

module.exports = {findAllMaterials,findMaterial}