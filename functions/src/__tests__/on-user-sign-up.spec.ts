import * as functionsTest from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as path from "path";
import { onUserSignUpTrigger } from "../on-user-sign-up.trigger";
import { MOCK_USER } from "./utils";

const projectConfig = {
  projectId: "get-hired-516c2",
  databaseURL: "get-hired-516c2"
};
const testEnv = functionsTest(
  projectConfig,
  path.resolve("get-hired-516c2-firebase-adminsdk-xb87j-ccd7e055b6.json")
);

describe("On user sign up", () => {
  beforeAll(() => {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://get-hired-516c2.firebaseio.com"
    });
  });

  afterAll(() => {
    // clean things up
    testEnv.cleanup();
    return admin
      .firestore()
      .doc("person/122")
      .delete();
  });

  it("should store a recently create user with the phone number", async () => {
    const wrapped = testEnv.wrap(onUserSignUpTrigger);

    await wrapped(MOCK_USER);
    // we read our user from database

    const createdUser = await admin
      .firestore()
      .doc(`/person/${MOCK_USER.uid}`)
      .get()
      .then(data => data.data());
    expect(createdUser).toEqual({ phone: MOCK_USER.phoneNumber });
  });
});
