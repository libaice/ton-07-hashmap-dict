import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type HashMapConfig = {};

export function hashMapConfigToCell(config: HashMapConfig): Cell {
    return beginCell().endCell();
}

export class HashMap implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HashMap(address);
    }

    static createFromConfig(config: HashMapConfig, code: Cell, workchain = 0) {
        const data = hashMapConfigToCell(config);
        const init = { code, data };
        return new HashMap(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
