import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
// 实现并导出我们合约的包装器

export class MainContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) { }

    // 从配置文件中创建合约
    static createFromConfig(config: any, code: Cell, workchain = 0) {
        const data = beginCell().endCell();
        const init = { code, data };
        const address = contractAddress(workchain, init);

        return new MainContract(address, init);
    }

    async sendInternalMessage(
        // provider 会自动传递
        provider: ContractProvider,
        sender: Sender,
        value: bigint
    ) {
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_the_latest_sender", []);
        return {
          recent_sender: stack.readAddress(),
        };
    }
}

