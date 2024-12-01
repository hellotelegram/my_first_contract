import { hex } from "../build/main.compiled.json";
import {
    Address,
    beginCell,
    Cell,
    contractAddress,
    StateInit,
    storeStateInit,
    toNano,
} from "@ton/core";

import qs from "qs";
import qrcode from "qrcode-terminal";
import { getInitInfo } from "./common";


async function deployScript() {
    console.log(
        "================================================================="
    );
    console.log("Deploy script is running, let's deploy our main.fc contract...");

    const { address, code, data } = getInitInfo();

    const stateInit: StateInit = {
        code: code,
        data: data,
    };

    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    console.log(
        `The address of the contract is following: ${address.toString({ testOnly: true })}`
    );
    console.log(`Please scan the QR code below to deploy the contract:`);

    let link =
        `https://tonhub.com/transfer/` +
        address.toString({
            testOnly: true,
        }) +
        "?" +
        qs.stringify({
            text: "Deploy contract",
            amount: toNano(0.005).toString(10),
            init: stateInitCell.toBoc({ idx: false }).toString("base64"),
        });

    qrcode.generate(link, { small: true }, (code) => {
        console.log(code);
    });
}

deployScript();