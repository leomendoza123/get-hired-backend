import { TestDefinition } from "./test.interface";

export interface Campaign {
  name: "";
  test: TestDefinition[];
  definedTest: TestDefinition[];
  client: string;
}
