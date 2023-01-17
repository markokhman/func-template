import { hex } from "../build/main.compiled.json";
import { Cell, contractAddress, StateInit, toNano } from "ton";
import qs from "qs";
import qrcode from "qrcode-terminal";

async function deployScript() {
  console.log(
    "================================================================="
  );
  console.log("Deploy script is running, let's deploy our main.fc contract...");
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const initCell = new Cell();
  new StateInit({
    code: codeCell,
    data: dataCell,
  }).writeTo(initCell);

  const address = contractAddress({
    workchain: 0,
    initialCode: codeCell,
    initialData: dataCell,
  });

  console.log(
    `The address of the contract is following: ${address.toFriendly({
      testOnly: process.env.TESTNET ? true : false,
    })}`
  );
  console.log(`Please scan the QR code below to deploy the contract:`);

  let link =
    `https://${process.env.TESTNET ? "test." : ""}tonhub.com/transfer/` +
    address.toFriendly({ testOnly: true }) +
    "?" +
    qs.stringify({
      text: "Deploy contract",
      amount: toNano(1).toString(10),
      init: initCell.toBoc({ idx: false }).toString("base64"),
    });

  qrcode.generate(link, { small: true }, (code) => {
    console.log(code);
  });
}

deployScript();
