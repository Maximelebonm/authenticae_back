const mailservice = require('../services/mail.service')
const orderservice = require('../services/order.service')

// Mise à jours de la commande par l'utilisateur

const getUserOrder = async(req,res)=>{
    try {
        const response = await orderservice.getUserOrder(req.params.id)
    if(response){
            res.status(200).send({message : "commandsgeted", data : response})
        }
        else {
            res.send({message : "not order", data : response})
        }
    } catch (err) {
        res.send({message : "error", error : err})
    }
}

const createOrder = async (req,t,id)=> {
    try {
            const resp = await orderservice.createOrder(req,t,id)
            if(resp){
                const mail = await mailservice.mailPaiement(req)
                return resp
            }   
        } catch (error) {
        return error
    }
}

const cancelOrder = async (req,t,status)=> {
    try {
        if(status === "A"){
            const resp = await orderservice.cancelOrder(req,t)
            if(resp){
                const mail = await mailservice.mailcancelOrder(req)
                return resp
            }      
        }
        if(status === "DA"){
            const resp = await orderservice.cancelOrder(req,t)
            return resp
        }
        } catch (error) {
        return error
    }
}

const cancelOrderInProgress = async (req,res)=> {
    try {
            const resp = await orderservice.cancelOrderInProgress(req)   
            res.send({message : "produit en cours d'annulation"})
        } catch (error) {
        return error
    }
}

const cancelOrderPercent = async(req,transaction,finalAmout)=>{
    try {
        const resp = await orderservice.cancelOrderPercent(req,transaction,finalAmout)   
        if(resp){
            const mail = await mailservice.mailCancelpercent(req,finalAmout)
            return resp
        }   
    } catch (error) {
        return error
    }
}

const cancelOrderProductByUser = async (req,t,refund,obj)=> {
    try {
        const resp = await orderservice.cancelOrderProductByUser(req,t,refund,obj)
        if(resp){
            const mail = await mailservice.mailCancelByUser(req)
            return resp
        }         
        return resp
    } catch (error) {
    return error
}
}

// Mise a jour commande par le producteur
const getProducerOrder = async(req,res)=>{
    try {
        const response = await orderservice.findProducerOrder(req.params.id)
    if(response){
            res.status(200).send({message : "order finded", data : response})
        }
        else {
            res.send({message : "not order", data : response})
        }
    } catch (err) {
        res.send({message : "error", error : err})
    }
}



const productOrderProduction =async(req,res)=>{
    try {
        const productUpdate = await orderservice.productOrderProduction(req.params.id)
        if(productUpdate[0] === 1){
            const mail = await mailservice.mailProduction(req)
            if(mail.accepted){
                res.send({message : 'produit pris en charge'})
            }
            else {
                res.send({message : 'error'})
            }
        }
    } catch (error) {
        res.send(error)
    }
}

const cancelProductOrderProduction =async(req,res)=>{
    try {
        const productUpdate = await orderservice.cancelProductOrderProduction(req.params.id)
        if(productUpdate === 'ok'){
            const mail = await mailservice.cancelmailProduction(req)
            if(mail.accepted){
                res.send({message : 'prise en charge annulé'})
            }
            else {
                res.send({message : 'mis à jours'})
            }
        }
    } catch (error) {
        res.send(error)
    }
}

const productOrderSend =async(req,t)=>{
    try {
        const productUpdate = await orderservice.productOrderSend(req,t)
        if(productUpdate === 'product update'){
            const mail = await mailservice.mailsendProduct(req)
            if(mail.accepted){
                return 'produit envoyé'
            }
            else {
                return 'mis à jours no mail'
            }
        }
    } catch (error) {
        return error
    }
}

const cancelProductOrderSend =async(req,res)=>{
    try {
        const productUpdate = await orderservice.cancelProductOrderSend(req.params.id)
        if(productUpdate === 'ok'){
            const mail = await mailservice.cancelmailsendProduct(req)
            if(mail.accepted){
                res.send({message : 'envoie annulé'})
            }
            else {
                res.send({message : 'mis à jours'})
            }
        }
    } catch (error) {
        res.send(error)
    }
}


module.exports = {createOrder,getProducerOrder,productOrderProduction,cancelProductOrderSend,productOrderSend,cancelProductOrderProduction,getUserOrder,cancelOrder,cancelOrderProductByUser,cancelOrderInProgress,cancelOrderPercent}