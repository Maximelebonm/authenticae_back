const personalizationService = require('../services/personalization.service')

const createPersonalization = async (req,res)=> {
    try {
        const createPersonalization = await personalizationService.createPersonalisation()
        res.status(200).send({message : 'product created', data : createProduct})
     
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

const deletePersonalization = async (req,res)=> {
    try {
        const createPersonalization = await personalizationService.deletePersonalization(req.body.Id_personalization)
        res.status(200).send({message : 'personalization deleted', data : createPersonalization})
     
    } catch (error) {
        res.status(500).send({message : 'une erreur est survenu', data : error})
    }
}

module.exports = {createPersonalization,deletePersonalization}