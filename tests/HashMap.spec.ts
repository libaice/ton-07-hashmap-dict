import {Blockchain, SandboxContract, TreasuryContract} from '@ton/sandbox';
import {beginCell, Cell, toNano} from '@ton/core';
import {HashMap} from '../wrappers/HashMap';
import '@ton/test-utils';
import {compile} from '@ton/blueprint';

describe('HashMap', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HashMap');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let hashMap: SandboxContract<HashMap>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.now = 500;
        deployer = await blockchain.treasury('deployer');
        hashMap = blockchain.openContract(HashMap.createFromConfig({
            manager: deployer.address
        }, code));

        const deployResult = await hashMap.sendDeploy(deployer.getSender(), toNano('0.01'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: hashMap.address,
            deploy: true,
        });

        await hashMap.sendSet(deployer.getSender(), toNano('0.05'), {
            queryId: 123n,
            key: 1n,
            validUntil: 1000n,
            value: beginCell().storeUint(123, 16).endCell().asSlice(),
        })

        await hashMap.sendSet(deployer.getSender(), toNano('0.05'), {
            queryId: 123n,
            key: 2n,
            validUntil: 2000n,
            value: beginCell().storeUint(234, 16).endCell().asSlice(),
        })

        await hashMap.sendSet(deployer.getSender(), toNano('0.05'), {
            queryId: 123n,
            key: 3n,
            validUntil: 3000n,
            value: beginCell().storeUint(345, 16).endCell().asSlice(),
        })


    });

    it('should store and retrieve values', async () => {
        let [validUntil, value] = await hashMap.getByKey(1n);
        expect(validUntil).toEqual(1000n);
        expect(value).toEqualSlice(beginCell().storeUint(123, 16).endCell().asSlice());
        // console.log('validUntil', validUntil);
        // console.log('value', value);

        let [validUntil2, value2] = await hashMap.getByKey(2n);
        expect(validUntil2).toEqual(2000n);
        expect(value2).toEqualSlice(beginCell().storeUint(234, 16).endCell().asSlice());

        // console.log('validUntil2', validUntil2);
        // console.log('value2', value2);
        //
        let [validUntil3, value3] = await hashMap.getByKey(3n);
        expect(validUntil3).toEqual(3000n);
        expect(value3).toEqualSlice(beginCell().storeUint(345, 16).endCell().asSlice());
        // console.log('validUntil3', validUntil3);
        // console.log('value3', value3);

    });


    it('should throw on not found key', async () => {
        await expect(hashMap.getByKey(123n)).rejects.toThrow();
    });


    it('should clear old values', async () => {
        await hashMap.sendClearOldValues(deployer.getSender(), toNano('0.05'), {
            queryId: 123n
        });

        let [validUntil, value] = await hashMap.getByKey(1n);
        console.log('validUntil ', validUntil);
        console.log('value ', value);
    });


    it('should throw on wrong opcode', async () => {

    });

    it('should throw on wrong query', async () => {

    });

});
