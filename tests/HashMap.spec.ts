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
            // success: true,
        });

        await hashMap.sendSet(deployer.getSender(), toNano('0.05'), {
            queryId: 123n,
            key: 1n,
            validUntil: 1000n,
            value: beginCell().storeUint(123, 16).endCell().asSlice(),
        })


    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and hashMap are ready to use
    });
});
