const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const { decodeToken } = require('../security/auth.security');
const upload = multer({
    storage : multer.diskStorage({
    destination : (req,file,cb)=>{
        console.log(req.params)
        const cookie = decodeToken(req.cookies.auth)
        const id = cookie.Id_user
        const path = `__dirname, '../../storage/${id}`;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
        // cb(null, path.join(__dirname, '../../../storage/'+ req.params.id))
    },
    filename : (req,file,cb)=> {
        cb(null, Date.now() + '-' + file.originalname)
    }
    }),
    limits : {fileSize : 1000000},
    fileFilter : (req,file,cb) =>{
        console.log(file)
        cb(null,true)
    }
})

module.exports = upload
