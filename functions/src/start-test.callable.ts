import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  TestDefinition,
  CreateTestEndpoint,
  TestInProgress,
  QuestionAsked
} from "./types";
import { Auth } from "./auth.helper";
import { DocumentSnapshot } from "@google-cloud/firestore";
import { getRandomQuestion } from "./test.helper";

// START-TEST (subject, force)
// return {question}
//
// verify the test subject is valid
// if force finish any pre-existing un-finished tests
// start a new tests and save send question and test as last send elements

export const startTestCallable = functions.https.onCall(
  (
    test: CreateTestEndpoint,
    context: functions.https.CallableContext
  ): Promise<QuestionAsked> => {
    const uid = Auth.getUid(context);
    const db = admin.firestore();
    // get the next question to ask
    return getTestDefinition(test, db).then(testDefinition =>
      createTest(testDefinition, uid, db).then(value => {
        const { lastSendQuestion } = value;
        delete lastSendQuestion.expectedAnswerId
        return lastSendQuestion;
      })
    );
    // create a new test for the user
  }
);

/*
   startTestCallable({client: "mockClient", campaign: "mockCampaign",subject: "mockSubject"})
*/

function getTestDefinition(
  test: CreateTestEndpoint,
  db: FirebaseFirestore.Firestore
): Promise<TestDefinition> {
  if (!test.campaign || !test.subject || !test.client) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The client, campaign or subject arguments were not set"
    );
  }
  return db
    .doc(
      `client/${test.client}/campaign.definition/${test.campaign}/test.definition/${test.subject}`
    )
    .get()
    .then((value: DocumentSnapshot) => {
      const data = value.data();
      if (data) {
        return data as TestDefinition;
      } else {
        throw new functions.https.HttpsError(
          "not-found",
          `The test ${test.subject}-${test.campaign}-${test.client} does not exist on ${test.campaign}.`
        );
      }
    });

  // TODO CHECK IF THE test and campaign exist
}

function createTest(
  testDefinition: TestDefinition,
  uid: string,
  db: FirebaseFirestore.Firestore
): Promise<TestInProgress> {
  const newTest: TestInProgress = {
    canFinish: false,
    lastSendQuestion: {
      optional: testDefinition.requiredAmountAnswers <= 0,
      ... getRandomQuestion(testDefinition.question)
    },
    startDate: new Date(),
    ...testDefinition
  };

  return db
    .doc(
      `client/${newTest.client}/campaign/${newTest.campaign}/user/${uid}/test/${newTest.subject}`
    )
    .create(newTest)
    .then(() => {
      return newTest;
    })
    .catch(error => {
      /// An error was trow because the document already existed
      // returns existing test
      return db
        .doc(
          `client/${newTest.client}/campaign/${newTest.campaign}/user/${uid}/test/${newTest.subject}`
        )
        .get()
        .then(value => {
          const existingTest = value.data() as TestInProgress;
          // The existing document is returned
          if (existingTest) {
            return existingTest;
          } else {
            throw new functions.https.HttpsError(
              "unknown",
              `Couldn't start the test`
            );
          }
        });
    });
}
