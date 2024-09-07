const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const { decodeToken } = require('../security/auth.security');
let storageConfig
if(process.env.NODE_ENV === "development"){
    storageConfig = '__dirname, ../../storage'
      
} else {
    storageConfig = process.env.STORAGE_PROD + '/storage'
}

const upload = multer({
    storage : multer.diskStorage({
    destination : (req,file,cb)=>{
        const cookie = decodeToken(req.cookies.auth)
        const id = cookie.Id_user
        const path = storageConfig + `/${id}`;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },
    filename : (req,file,cb)=> {
        cb(null, Date.now() + '-' + file.originalname)
    }
    }),
    limits : {fileSize : 1000000},
    fileFilter : (req,file,cb) =>{
        cb(null,true)
    }
})

module.exports = upload
