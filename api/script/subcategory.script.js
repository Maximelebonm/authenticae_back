const categorySchema = require('../schemas/categoryProduct.schema');
const subcategoryproductSchema = require('../schemas/subCategoryProduct.schema')

const subcategoryInit = async () => {
    try{
        const subcategoryCreated = await subcategoryproductSchema.bulkCreate([
            {   name : 'collier',
                Id_categoryProduct : '',
            },
            { name : 'High tech'},
            { name : 'Bijoux' },
            { name : 'Beauté' },
            { name : 'Bébé'},
            { name : 'Décoration' },
            { name : 'Extérieur' },
            { name : 'Evènement' },
            { name : 'Jouer' },
            { name : 'Art' },
            { name : 'Personalisation' },
            { name : 'Sac et Bagages'},
            { name : 'Vêtements et Chaussure' },
          ]);
        return console.log(subcategoryCreated);
    } catch (err) {
        return console.log(err)
    }
}

module.exports = subcategoryInit