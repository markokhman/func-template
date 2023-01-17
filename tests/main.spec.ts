import {
  Cell,
  beginCell,
  CommonMessageInfo,
  InternalMessage,
  CellMessage,
  Slice,
} from "ton";
import { hex } from "../build/main.compiled.json";
import { SmartContract } from "ton-contract-executor";
import { randomAddress, zeroAddress } from "./helpers";

describe("main.fc contract tests", () => {
  it("should get the proper most recent sender address", async () => {
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const initDataCell = beginCell().endCell();
    const contract = await SmartContract.fromCell(codeCell, initDataCell);

    const messageBody = new Cell();

    console.log(randomAddress("notowner"));

    const message = new InternalMessage({
      to: zeroAddress,
      from: randomAddress("notowner"),
      value: 0,
      bounce: false,
      body: new CommonMessageInfo({ body: new CellMessage(messageBody) }),
    });

    const result = await contract.sendInternalMessage(message);

    expect(result.type).toBe("success");

    const call = await contract.invokeGetMethod("get_the_latest_sender", []);

    expect(call.type).toBe("success");

    if (call.type !== "success") {
      throw new Error("call failed");
    }

    const most_recent_sender = (call.result[0] as Slice).readAddress();

    expect(most_recent_sender?.toFriendly()).toBe(
      randomAddress("notowner").toFriendly()
    );
  });
});

// beforeEach(async () => {
//   masterContract = await OracleV1LocalMaster.createFromConfig(config);
// });
