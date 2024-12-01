import * as fs from "fs";
import process from "process";
import { Cell } from "@ton/core";
import { compileFunc } from "@ton-community/func-js";

// 这个是编译为hex的脚本
async function compileScript() {
    console.log(
        "================================================================="
    );
    console.log(
        "Compile script is running, let's find some FunC code to compile..."
    );

    const compileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x) => fs.readFileSync(x).toString("utf8"),
    });

    if (compileResult.status === "error") {
        console.log(" - OH NO! Compilation Errors! The compiler output was:");
        console.log(`\n${compileResult.message}`);
        process.exit(1);
    }

    console.log(" - Compilation successful!");

    const hexArtifact = `build/main.compiled.json`;

    fs.writeFileSync(
        hexArtifact,
        JSON.stringify({
            // compileResult.codeBoc 是base64编码的，需要先转换为buffer，然后转换为Cell，再转换为boc，最后转换为hex
            hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc, "base64"))[0]
                .toBoc()
                .toString("hex"),
        })
    );

    console.log(" - Compiled code saved to " + hexArtifact);
}
compileScript();