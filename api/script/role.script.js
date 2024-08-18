const roleSchema = require('../schemas/role.schema');

const roleInit = async () => {
    try{
        const roleCreated = await roleSchema.bulkCreate([
            { name: 'producer' },
            { name: 'client' },
            { name : 'moderator'},
            { name : 'administrator'},
          ]);
        return "OK";
    } catch (err) {
        return err
    }
}

module.exports = roleInit