import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { HashMap } from '../wrappers/HashMap';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

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

        hashMap = blockchain.openContract(HashMap.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await hashMap.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: hashMap.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and hashMap are ready to use
    });
});
