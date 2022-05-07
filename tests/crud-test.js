const Crud = artifacts.require('Crud');

contract('Crud', () => {
    let crud = null;
    before(async () => {
        crud = await Crud.deployed();
    });

    it('Should create new user', async () => {
        await crud.create('AndyB');
        crud.read(1);
        const user= await crud.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'AndyB');
    });

    it('Should update a user', async () => {
        await crud.update(1, 'AndyP');
        const user = await crud.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'AndyP');
    });

    // Test errors in smart contracts
    it('Should not update a non existing user', async () => {
        try {
            await crud.update(2, 'Balls');
        } catch (err) {
            assert(err.message.includes('User does not exist'));
            return;
        }
        assert(false);
    });

    it('Should delete a user', async () => {
        await crud.destroy(1);
        try {
            await crud.read(1);
        } catch (err) {
            assert(err.message.includes('User does not exist'));
            return;
        }
        assert(false);
        }
    );

    it('Should NOT destroy a non-existing user', async() => {
        try {
            await crud.destroy(10);
        } catch (err) {
            assert(err.message.includes('User does not exist'));
            return;
        }
        assert(false);
        
    });
});