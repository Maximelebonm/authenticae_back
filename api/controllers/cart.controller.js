const cartService = require('../services/cart.service')
const security = require('../security/auth.security')
const userService = require('../services/user.service')

const findCartAndProducts=async (req,res)=>{
    try {
        const response = await cartService.findCartAndProducts(req.params.id)
    if(response){
            res.status(200).send({message : "cart loaded", data : response})
        }
        else {
            res.clearCookie('cart');
            res.send({message : "cart unexiste", data : response})
        }
    } catch (err) {
        res.send(err)
    }
}

const cartControl = async (req, res)=>{
    try {
        const cookie = security.parseCookies(req.headers.cookie)
        let token = cookie.auth

        if(token){
            const decode = security.decodeToken(token)
            
            const cart = await cartService.findActiveCart(decode.Id_user)
            if(cart.length == 1 && req.body.state == 'add'){
                updateAddCart(req,res,cart[0])
            }
            if(cart.length <= 1 && req.body.state == 'delete'){
                deleteCartProduct(req,res,cart[0])
            }
            else if (cart.length > 1) {
                res.send({message : "il existe plus d'un panier"})
            }
            else if (cart.length == 0) {
                createCart(req,res,decode.Id_user)
            }
        }
    } catch (error) {
        res.send(error)
    }
}

const createCart = async (req,res,id_user)=> {
    try {
        const createCart = await cartService.createCart(req,res,id_user)
        if(createCart.Id_cart){
            const accessToken =  security.jwtCart(createCart.Id_cart)
            res.cookie('cart', accessToken,{
                maxAge : 864000000,
                secure : true,
                sameSite:'none',
              })
            res.status(200).send({message : 'cart créé', data : createCart})
        }
        if(createCart.errors){
            if(createCart.name === 'SequelizeUniqueConstraintError'){
                res.send({message : 'SequelizeUniqueConstraintError'})
            }
        }
    } catch (error) {
        res.status(500).send({message : 'erreur', data : error})
    }
}

const deleteCartProduct = async (req,res,cart)=> {
    try {
        const updatedCart = await cartService.deleteProductCart(req,cart)
        if(updatedCart === "ok"){
            res.status(200).send({message : 'product deleted', data : updatedCart})
        }
    } catch (error) {
        res.status(500).send({message : 'erreur', data : error})
    }
}

const updateAddCart = async (req,res,cart)=> {
    try {
        const updatedCart = await cartService.updateAddCart(req,cart)
        if(updatedCart === "ok"){
            res.status(200).send({message : 'cart updated', data : updatedCart})
        }
    } catch (error) {
        res.status(500).send({message : 'erreur', data : error})
    }
}

module.exports = {createCart, cartControl,updateAddCart,findCartAndProducts}