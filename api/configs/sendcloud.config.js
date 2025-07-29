require('dotenv').config()

let SendCloudConfig = {}

if(process.env.NODE_ENV === "development"){
    SendCloudConfig = {

    }
}

module.exports = SendCloudConfig