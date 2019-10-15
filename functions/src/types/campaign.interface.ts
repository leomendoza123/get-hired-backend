import { CreateTestEndpoint } from "./test.interface";

export interface Campaign {
  name: "";
  test: CreateTestEndpoint[];
  definedTest: CreateTestEndpoint[];
  client: string;
}

export interface CreateCampaignEndpoint {
  name: string;
  client: string;
}
