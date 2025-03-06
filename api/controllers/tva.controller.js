const tvaService = require('../services/tva.service')
const express = require('express');
const path = require('path');

const findAllTva = async (req,res) => {
    try {
        const tva = await tvaService.getTVA()
        res.send(tva)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {findAllTva}