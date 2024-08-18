const materialSchema = require('../schemas/material.schema');

const materialInit = async () => {
    try{
        const MaterialCreated = await materialSchema.bulkCreate([
            { name : 'Argile'},
            { name: 'Bambou' },
            { name: 'Bois' },
            { name: 'Béton' },
            { name : 'Carton'},
            { name : 'Cuir'},
            { name : 'Crystal'},
            { name: 'Fer' },
            { name: 'Feutre' },
            { name : 'Laine'},
            { name : 'Or'},
            { name : 'Papier'},
            { name : 'Pâte Polimère'},
            { name : 'Pierre'},
            { name : 'Plastique'},
            { name : 'Résine époxy'},
            { name : 'Soie'},
            { name : 'Tissus'},
            { name : 'Verre'},
          ]);
        return "OK";
    } catch (err) {
        return err
    }
}

module.exports = materialInit