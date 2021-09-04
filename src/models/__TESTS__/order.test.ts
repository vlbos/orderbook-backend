import mongoose from "mongoose";
import OrderJSONModel, { OrderJSON } from "../order.model";
import * as ordersJSONFixture from '../../fixtures/orders.json'

describe("OrderJSON model", () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it("Should throw validation errors", () => {
    const orderJSONModel = new OrderJSONModel();

    expect(orderJSONModel.validate).toThrow();
  });

  it("Should save a orderJSONModel", async () => {
    expect.assertions(3);

    const orderJSONModel: OrderJSON = new OrderJSONModel(ordersJSONFixture[0]);
    const spy = jest.spyOn(orderJSONModel, "save");

    // Should await so the teardown doesn't throw an exception
    // Thanks @briosheje
    orderJSONModel.save();

    expect(spy).toHaveBeenCalled();

    expect(orderJSONModel).toMatchObject({
       "calldata": "0x23b872dd000000000000000000000000e96a1b303a1eb8d04fb973eb2b291b8d591c8f72000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f9",
       "exchange": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
       "extra": "0",
       "salt": "83006245783548033686093530747847303952463217644495033304999143031082661844460",
       "side": 1,
       "target": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    });

    expect(orderJSONModel.extra).toBe("0");
  });
});
