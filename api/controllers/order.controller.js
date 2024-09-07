const mailservice = require('../services/mail.service');
const orderservice = require('../services/order.service');
const pdfService = require('../services/pdf.service');
const path = require('path');
const storageConfig = require('../configs/storage.config')

// Mise à jours de la commande par l'utilisateur

//Obtention des commande pas l'utilisateur (historique de commande)
const getUserOrder = async(req,res)=>{
    try {
        const response = await orderservice.getUserOrder(req.params.id)
    if(response){
        // fileDest : express.static(path.join(__dirname, '../../document'))
            res.status(200).send({message : "commandsgeted", data : response})
        }
        else {
            res.send({message : "not order", data : response})
        }
    } catch (err) {
        res.send({message : "error", error : err})
    }
}

//creation de la commande et de la facture + mail
const createOrder = async (req,id)=> {
    try {
            const resp = await orderservice.createOrder(req,id)
            if(resp.Id_order){
                const filePath = path.join(__dirname, `../../documents/${resp.Id_user}/${resp.Id_order}.pdf`);
                const getOrder = await orderservice.getOrderByIdOrder(resp.Id_order)
                const pdf = await pdfService.createFacture(getOrder.toJSON(),req,filePath)
                if(pdf === 'facture created'){
                    const filePathToSave = `documents/${resp.Id_user}/${resp.Id_order}.pdf`
                    const stroreFacture = orderservice.addPdfStorage(filePathToSave,resp.Id_order)
                }
                const mail = await mailservice.mailPaiement(req)
                return resp
            }   
        } catch (error) {
            return error
    }
}

//Annulation de la commande
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

//cancel une commande qui a été commencé et pris en charge par un producteur
const cancelOrderInProgress = async (req,res)=> {
    try {
            const resp = await orderservice.cancelOrderInProgress(req)   
            res.send({message : "produit en cours d'annulation"})
        } catch (error) {
        return error
    }
}

//Annulation d'un produit avec le pourcentage effectué par le producteur
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

//annulation d'un produit par l'utilisateur (non pris en charge par un producteur)
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

//Producteur qui peut voir les commande qui lui sont associé
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


//prise en charge d'un produit
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

//annulation de prise en charge par un producteur (erreur de la part du producteur)
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

//produit envoyé
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

//annulation d'un produit envoyé (erreur de la part du producteur)
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