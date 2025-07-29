const mrService = require('../services/mr.service.js');
const userService = require('../services/user.service.js');
const orderService = require('../services/order.service.js');

//creation d'une étiquette de livraison Mondial relay
const MrCreateLabel = async(req,res)=>{
    try {
        const userToSend = await userService.findOneUserByID(req.body.user.Id_user)
        const data = await mrService.generateLabel(req, userToSend)
        if(data.sendingNumber) {
            const MajOrder = await orderService.labelUpdated(req.body.Id_order_product, data)
          res.send(data)
        } else {
          res.status(404).send({ message: "Label not found" })
        }
    } catch (error) {
        res.send(error)
    }
}

const MrGetLabel = async(req,res)=>{
    try {
        const data = await mrService.getLabelForShipment(req)
        res.send(data)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {MrCreateLabel,MrGetLabel}