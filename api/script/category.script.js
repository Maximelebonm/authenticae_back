const categorySchema = require('../schemas/categoryProduct.schema');

const categoryInit = async () => {
    try{
        const categoryCreated = await categorySchema.bulkCreate([
            { name : 'Accessoires'},
            {name : 'High tech'},
            { name : 'Bijoux' },
            { name : 'Beauté' },
            { name : 'Bébé'},
            { name: 'Décoration' },
            { name: 'Extérieur' },
            { name : 'Evènement' },
            { name : 'Jouer' },
            { name: 'Art' },
            { name: 'Personalisation' },
            { name : 'Sac et Bagages'},
            { name: 'Vêtements et Chaussure' },
          ]);
        return "OK";
    } catch (err) {
        return err
    }
}

module.exports = categoryInit