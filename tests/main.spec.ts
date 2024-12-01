import { Cell, toNano } from "@ton/core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton/sandbox";
import { MainContract } from "../wrappers/MainContract";
import "@ton/test-utils";

describe("main.fc contract tests", () => {
    it("should get the proper most recent sender address", async () => {
        const blockchain = await Blockchain.create();
        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({}, codeCell)
        );

        // 创建一个sender钱包(钱包是合约的一种)
        const senderWallet = await blockchain.treasury("sender");
        // 发送一个内部消息 (使用此方法时我们不必担心传递 ContractProvider，它将作为合约实例内置功能的一部分在底层传递)
        const sentMessageResult = await myContract.sendInternalMessage(
            senderWallet.getSender(),
            toNano("0.05")
        );

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

        const data = await myContract.getData();

        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
    });
});
