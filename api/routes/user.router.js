const express = require('express');
const userController = require("../controllers/user.controller");
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../configs/app.config');
const { jwtsecurity, decodeToken,jwtCart } = require('../security/auth.security');
const googleConfig = require('../configs/google.config')

router.get("/", userController.findAllUser);

router.get("/profile/:id", userController.findUserByID);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/delete/:id");
router.put("/update/:id", protect,userController.updateUser);
router.post('/password');
router.post('/validation', userController.emailValidation)
router.get('/redirect/logout', protect, userController.logoutUser);
router.post('/pseudo/:id', protect, userController.createPseudo)


/* 
**************************************************************************
                            GOOGLE AUTH 2.0 
**************************************************************************
*/

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLEID_CLIENT,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleConfig
  },
  async function(request,accessToken, refreshToken, profile, cb) {
    const googleChecked = await userController.checkGoogleUser(profile)
      return cb(null, googleChecked);
  }
));

router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/users/google/login/failed'}),async function(req, res) {
    const findCompleteUser = await userController.findUserByID(req)
    const accessToken = jwtsecurity(findCompleteUser)
    res.cookie('auth', accessToken,{
      maxAge : 864000000,
      secure : true,
      sameSite:'none',
    })
    if(findCompleteUser.carts.length > 0){
      const accessTokenCart =  jwtCart(findCompleteUser.carts[0].Id_cart)
        res.cookie('cart', accessTokenCart,{
            maxAge : 864000000,
            secure : true,
            sameSite:'none',
          })
    }
    res.redirect(config.origin);
  });

router.get('/google/login/failed', (req,res)=>{res.status(401).json({error : true, message : 'log in failure'})})

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('auth');
        res.clearCookie('cart');
        res.clearCookie('pma_lang');
        res.send({message : 'deconnexion OK'})
    });
});

module.exports = router
