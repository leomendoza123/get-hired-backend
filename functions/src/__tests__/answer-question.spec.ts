import * as functionsTest from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as path from "path";
import { exampleUserRecord } from "firebase-functions-test/lib/providers/auth";
import { MOCK_TEST, createMockTestInProgress, MOCK_ANSWER } from "./utils";
import { QuestionAsked, TestInProgress } from "../types";
import { answerQuestionCallable } from "../answer-question.callable";

const projectConfig = {
  projectId: "get-hired-516c2",
  databaseURL: "get-hired-516c2"
};
const testEnv = functionsTest(
  projectConfig,
  path.resolve("get-hired-516c2-firebase-adminsdk-xb87j-ccd7e055b6.json")
);

describe("On start test", () => {
  beforeAll(() => {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://get-hired-516c2.firebaseio.com"
    });
  });
  afterAll(async () => {
    // await deleteMockClient();
    testEnv.cleanup();
  });

  it("should save the answer and send another answer ", async () => {
    const wrapped = testEnv.wrap(answerQuestionCallable);

    await createMockTestInProgress();
    const secondQuestionAsked: QuestionAsked = await wrapped(MOCK_ANSWER, {
      auth: exampleUserRecord()
    });

    expect(secondQuestionAsked).toHaveProperty(["answers"]);
    expect(secondQuestionAsked).toHaveProperty(["id"]);
    expect(secondQuestionAsked).toHaveProperty(["optional"]);
    expect(secondQuestionAsked).toHaveProperty(["value"]);
    expect(secondQuestionAsked).not.toHaveProperty(["expectedAnswerId"]);
    expect(secondQuestionAsked.answers.length).toBeGreaterThan(0);

    const testInProgress: TestInProgress = await admin
      .firestore()
      .doc(
        `/client/${MOCK_TEST.client}/campaign/${MOCK_TEST.campaign}/user/${
          exampleUserRecord().uid
        }/test/${MOCK_TEST.subject}`
      )
      .get()
      .then(data => data.data() as TestInProgress);

    expect(testInProgress.question[0]).toHaveProperty(["answer"]);
  });
});
