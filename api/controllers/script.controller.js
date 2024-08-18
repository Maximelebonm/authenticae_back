const roleSchema = require('../schemas/role.schema')
const scriptInit = require('../script/index.script')

const initData = async (req, res)=> {
    try {
        const FindAllRole = await roleSchema.FindAll()
        if(FindAllRole.length === 0){
            const scriptInitialized = await scriptInit()
            if(scriptInitialized === "db initialized , userAdmin created"){
                console.log("db initialized , userAdmin created")
            } else {
                console.log("Initialization failed: roles, materials, or categories not created.")
            }
        } else {
            console.log('Database already initialized');
        }
    } catch (err) {
        console.log('error : ',err)
    }
}

module.exports = {initData}