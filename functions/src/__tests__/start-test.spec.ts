import * as functionsTest from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as path from "path";
import { startTestCallable } from "../start-test.callable";
import { exampleUserRecord } from "firebase-functions-test/lib/providers/auth";
import { MOCK_TEST, createMockTest, MOCK_START_TEST, deleteMockClient } from "./utils";
import { TestInProgress, QuestionAsked } from "../types";

const projectConfig = {
  projectId: "get-hired-516c2",
  databaseURL: "get-hired-516c2"
};
const testEnv = functionsTest(
  projectConfig,
  path.resolve("get-hired-516c2-firebase-adminsdk-xb87j-ccd7e055b6.json")
);

fdescribe("On start test", () => {
  beforeAll(() => {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://get-hired-516c2.firebaseio.com"
    });
  });
  afterAll(async () => {
    await deleteMockClient();
    testEnv.cleanup();
  });

  it("should create a test for the user and return a question", async () => {
    const wrapped = testEnv.wrap(startTestCallable);

    await createMockTest();
    const questionAsked: QuestionAsked = await wrapped(MOCK_START_TEST, {
      auth: exampleUserRecord()
    });

    expect(questionAsked).toHaveProperty(["answers"]);
    expect(questionAsked).toHaveProperty(["id"]);
    expect(questionAsked).toHaveProperty(["optional"]);
    expect(questionAsked).toHaveProperty(["value"]);
    expect(questionAsked).not.toHaveProperty(["expectedAnswerId"]);
    expect(questionAsked.answers.length).toBeGreaterThan(0);

    const createdTest: TestInProgress = await admin
      .firestore()
      .doc(
        `/client/${MOCK_TEST.client}/campaign/${MOCK_TEST.campaign}/user/${
          exampleUserRecord().uid
        }/test/${MOCK_TEST.subject}`
      )
      .get()
      .then(data => data.data() as TestInProgress);


    expect(createdTest).toHaveProperty(["lastSendQuestion"]);
    expect(createdTest.lastSendQuestion).toEqual({ expectedAnswerId: MOCK_TEST.question[0].expectedAnswerId , ...questionAsked});
    expect(createdTest).toHaveProperty(["canFinish"]);
    expect(createdTest).toHaveProperty(["startDate"]);
  });
});
