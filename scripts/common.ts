import { Address, beginCell, Cell, contractAddress } from "@ton/core";
import { hex } from "../build/main.compiled.json";

import dotenv from "dotenv"
dotenv.config();

export function getInitInfo(): { address: Address, code: Cell, data: Cell } {
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const initialAddress = Address.parse('0QBzVFvOkvPS0_BDwLQNa6V20PPoPfMPKzIiB1RppBKQxEMU')
    const dataCell = beginCell().storeAddress(initialAddress).endCell();

    const address = contractAddress(0, {
        code: codeCell,
        data: dataCell,
    });

    console.log("=================address:", address.toString({ testOnly: true }));
    return { address, code: codeCell, data: dataCell };
}