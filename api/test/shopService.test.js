// test/shopController.test.js

const { createShop,updateShop } = require('../services/shop.service');
const shopSchema = require('../schemas/shop.schema');

jest.mock('../schemas/shop.schema'); // Mock the entire shopSchema module

describe('updateShop' , ()=> {
    let req;
    beforeEach(()=>{
        req = {
            body : {
                name: 'Updated Shop',
                description: 'Updated description',
                phone: '123456789',
                social_media: '@updatedShop',
            },
            params: {
                id: 1,
            },
        }
    })
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });
    it('should update a shop successfully', async () => {
        // Mock la méthode update de shopSchema
        shopSchema.update.mockResolvedValue([
            1, // Indique qu'une ligne a été affectée
            [{
                name: 'Updated Shop',
                description: 'Updated description',
                phone: '123456789',
                social_media: '@updatedShop',
                updated_by: 'user',
                updated_date: expect.any(Number),
            }]
        ]);

        const result = await updateShop(req);

        expect(shopSchema.update).toHaveBeenCalledTimes(1);
        expect(shopSchema.update).toHaveBeenCalledWith(
            {
                name: 'Updated Shop',
                description: 'Updated description',
                phone: '123456789',
                social_media: '@updatedShop',
                updated_by: 'user',
                updated_date: expect.any(Number),
            },
            {
                where: { Id_user: req.params.id },
            }
        );
        expect(result).toEqual([
            1, 
            [{
                name: 'Updated Shop',
                description: 'Updated description',
                phone: '123456789',
                social_media: '@updatedShop',
                updated_by: 'user',
                updated_date: expect.any(Number),
            }]
        ]);
    });

    it('should return an error when shop update fails', async () => {
        const error = new Error('Update failed');
        shopSchema.update.mockRejectedValue(error);

        const result = await updateShop(req);

        expect(shopSchema.update).toHaveBeenCalledTimes(1);
        expect(result).toBe(error);
    });

})


describe('createShop', () => {
    let req;
    beforeEach(() => {
        req = {
            body: {
                name: 'Test Shop',
                description: 'A shop for testing',
            },
            params: {
                id: 1,
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should create a shop successfully', async () => {
        // Mock the create method of shopSchema
        shopSchema.create.mockResolvedValue({
            name: 'Test Shop',
            description: 'A shop for testing',
            Id_user: 1,
            created_by: 'user',
        });

        const result = await createShop(req);

        expect(shopSchema.create).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            name: 'Test Shop',
            description: 'A shop for testing',
            Id_user: 1,
            created_by: 'user',
        });
    });

    it('should return an error when shop creation fails', async () => {
        // Mock the create method to throw an error
        const error = new Error('Creation failed');
        shopSchema.create.mockRejectedValue(error);

        const result = await createShop(req);

        expect(shopSchema.create).toHaveBeenCalledTimes(1);
        expect(result).toBe(error);
    });
});
