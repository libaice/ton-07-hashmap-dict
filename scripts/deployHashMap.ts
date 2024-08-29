import { toNano } from '@ton/core';
import { HashMap } from '../wrappers/HashMap';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const hashMap = provider.open(HashMap.createFromConfig({}, await compile('HashMap')));

    await hashMap.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(hashMap.address);

    // run methods on `hashMap`
}
