const mrService = require('../services/mr.service.js');

const MrFirstRequest = async(req,res)=>{
    try {
        const data = await mrService.MrConnection(req)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {MrFirstRequest}