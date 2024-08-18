const roleSchema = require('../schemas/role.schema');
const materialSchema = require('../schemas/material.schema')
const categorySchema = require('../schemas/categoryProduct.schema')

jest.mock('../schemas/material.schema');
jest.mock('../schemas/role.schema');
jest.mock('../schemas/categoryProduct.schema');

const roleInit  = require('../script/role.script')
const materialInit = require('../script/material.script')
const categoryInit = require('../script/category.script')

jest.mock('../configs/db.config', () => {
    const Sequelize = jest.requireActual('sequelize'); // Importe le vrai Sequelize
    const mSequelize = {
        define: jest.fn().mockReturnValue({
            bulkCreate: jest.fn()
        }),
        sync: jest.fn().mockResolvedValue(true),
        Sequelize: Sequelize, // Vous pouvez inclure d'autres aspects du Sequelize réel si nécessaire
    };
    return mSequelize;
});

describe('roleInit' , ()=> {
    it('should create roles successfully and return "OK"', async () => {
        // Mock de bulkCreate pour qu'il résolve avec succès
        roleSchema.bulkCreate.mockResolvedValueOnce([
            { name: 'producer' },
            { name: 'client' },
            { name: 'moderator' },
            { name: 'administrator' },
        ]);

        const result = await roleInit();
        
        expect(roleSchema.bulkCreate).toHaveBeenCalledWith([
            { name: 'producer' },
            { name: 'client' },
            { name: 'moderator' },
            { name: 'administrator' },
        ]);

        // On vérifie que le résultat est "OK"
        expect(result).toBe("OK");
    }) 
    it('should return an error if bulkCreate fails', async () => {
        const errorMessage = new Error('Something went wrong');
        
        // Mock de bulkCreate pour qu'il rejette avec une erreur
        roleSchema.bulkCreate.mockRejectedValueOnce(errorMessage);

        const result = await roleInit();
 
        // On vérifie que le résultat est l'erreur
        expect(result).toBe(errorMessage);
    });
});

describe('materialInit' , ()=> {
        it('should create materials successfully and return "OK"', async () => {
            // Mock de bulkCreate pour qu'il résolve avec succès
            materialSchema.bulkCreate.mockResolvedValueOnce([
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
    
            const result = await materialInit();
            
            expect(materialSchema.bulkCreate).toHaveBeenCalledWith([
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
    
            // On vérifie que le résultat est "OK"
            expect(result).toBe("OK");
        }) 
        it('should return an error if bulkCreate fails', async () => {
            const errorMessage = new Error('Something went wrong');
            
            // Mock de bulkCreate pour qu'il rejette avec une erreur
            materialSchema.bulkCreate.mockRejectedValueOnce(errorMessage);
    
            const result = await materialInit();
    
            // On vérifie que le résultat est l'erreur
            expect(result).toBe(errorMessage);
        });
});

describe('categoryInit' , ()=> {
    it('should create materials successfully and return "OK"', async () => {
        // Mock de bulkCreate pour qu'il résolve avec succès
        categorySchema.bulkCreate.mockResolvedValueOnce([
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

        const result = await categoryInit();
        
        expect(categorySchema.bulkCreate).toHaveBeenCalledWith([
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

        // On vérifie que le résultat est "OK"
        expect(result).toBe("OK");
    }) 
    it('should return an error if bulkCreate fails', async () => {
        const errorMessage = new Error('Something went wrong');
        
        // Mock de bulkCreate pour qu'il rejette avec une erreur
        categorySchema.bulkCreate.mockRejectedValueOnce(errorMessage);

        const result = await categoryInit();

        // On vérifie que le résultat est l'erreur
        expect(result).toBe(errorMessage);
    });
});

const initData = require('../script/index.script'); // Assurez-vous que le chemin est correct
const db = require('../configs/db.config');
const userController = require("../controllers/user.controller");
const userService = require('../services/user.service');
const roleService = require('../services/role.service');

jest.mock('../configs/db.config');
jest.mock('../schemas/material.schema');
jest.mock('../schemas/categoryProduct.schema');
jest.mock('../controllers/user.controller');
jest.mock('../services/user.service');
jest.mock('../services/role.service');
jest.mock('../schemas/user_role.schema');

describe('initData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize the database and create the admin user', async () => {
        db.authenticate.mockResolvedValue();
        db.sync.mockResolvedValue();

        roleSchema.findAll.mockResolvedValue([]);
        materialSchema.findAll.mockResolvedValue([]);
        categoryProductSchema.findAll.mockResolvedValue([]);

        roleInit.mockResolvedValue("OK");
        materialInit.mockResolvedValue("OK");
        categoryInit.mockResolvedValue("OK");

        const userCreated = { Id_user: 1 };
        userController.registerFirstUser.mockResolvedValue(userCreated);
        userService.findOneUserByID.mockResolvedValue(userCreated);
        roleService.addRole.mockResolvedValue(true);

        const result = await initData();

        expect(db.authenticate).toHaveBeenCalled();
        expect(db.sync).toHaveBeenCalled();
        expect(roleSchema.findAll).toHaveBeenCalled();
        expect(materialSchema.findAll).toHaveBeenCalled();
        expect(categoryProductSchema.findAll).toHaveBeenCalled();
        expect(roleInit).toHaveBeenCalled();
        expect(materialInit).toHaveBeenCalled();
        expect(categoryInit).toHaveBeenCalled();
        expect(userController.registerFirstUser).toHaveBeenCalledWith(adminUser);
        expect(userService.findOneUserByID).toHaveBeenCalledWith(userCreated.Id_user);
        expect(roleService.addRole).toHaveBeenCalledWith(adminUser.body.role, userCreated);
        expect(result).toBe("Database initialized and admin user created successfully");
    });

    it('should return "Database already initialized" if roles, materials, and categories already exist', async () => {
        db.authenticate.mockResolvedValue();
        db.sync.mockResolvedValue();

        roleSchema.findAll.mockResolvedValue([{ id: 1 }]);
        materialSchema.findAll.mockResolvedValue([{ id: 1 }]);
        categoryProductSchema.findAll.mockResolvedValue([{ id: 1 }]);

        const result = await initData();

        expect(result).toBe("Database already initialized");
        expect(roleInit).not.toHaveBeenCalled();
        expect(materialInit).not.toHaveBeenCalled();
        expect(categoryInit).not.toHaveBeenCalled();
        expect(userController.registerFirstUser).not.toHaveBeenCalled();
    });

    it('should throw an error if initialization fails', async () => {
        const errorMessage = new Error("Initialization error");
        db.authenticate.mockRejectedValue(errorMessage);

        await expect(initData()).rejects.toThrow("Initialization error");

        expect(db.authenticate).toHaveBeenCalled();
        expect(db.sync).not.toHaveBeenCalled();
    });
});

