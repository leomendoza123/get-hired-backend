import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";
import { getFilterQuestions } from "./test.helper";
import {
  TestInProgress,
  TestFinished,
  CreateTestEndpoint,
  QuestionAnswered
} from "./types";

export const finishTestCallable = functions.https.onCall(
  (test: CreateTestEndpoint, context: functions.https.CallableContext) => {
    const uid = Auth.getUid(context);
    const db = admin.firestore();

    if (!test || !test.client || !test.campaign || !test.subject) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The client, campaign, subject or answer value arguments were not set"
      );
    }

    return db
      .doc(
        `client/${test.client}/campaign/${test.campaign}/user/${uid}/test/${test.subject}`
      )
      .get()
      .then(response => {
        const testOnDatabase = response.data();

        if (!testOnDatabase) {
          throw new functions.https.HttpsError(
            "not-found",
            `The test "${test.client}-${test.campaign}-${test.subject}" was not found, did you start it?`
          );
        }
        if ((testOnDatabase as TestFinished).finished) {
          throw new functions.https.HttpsError(
            "not-found",
            `The test "${test.client}-${test.campaign}-${test.subject}" was already finished`
          );
        }
        if (!(testOnDatabase as TestInProgress).canFinish) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            `The test "${test.client}-${test.campaign}-${test.subject}" is not ready to finish`
          );
        } else {
          const testInProgress = testOnDatabase as TestInProgress;

          // Calculates the score
          let numberAnswerQuestions = 0;
          let correctAnswers = 0;
          const questions = getFilterQuestions(testOnDatabase.question, true);
          questions.forEach(question => {
            numberAnswerQuestions++;
            if (
              question.expectedAnswerId &&
              (question as QuestionAnswered).answer.id ===
                question.expectedAnswerId
            ) {
              correctAnswers++;
            }
          });

          // Create the finished test object
          console.log(correctAnswers, "--", numberAnswerQuestions);

          const testToFinish: TestFinished = {
            score: correctAnswers / numberAnswerQuestions,
            finished: new Date(),
            startDate: testInProgress.startDate,
            question: testInProgress.question,
            requiredAmountAnswers: testInProgress.requiredAmountAnswers,
            client: testInProgress.client,
            campaign: testInProgress.campaign,
            subject: testInProgress.subject
          };
          // Save the test as finished
          return db
            .doc(
              `client/${test.client}/campaign/${test.campaign}/user/${uid}/test/${test.subject}`
            )
            .set(testToFinish)
            .then(() => {
              // Save the test as finished
              return db
                .collection(
                  `person/${uid}/test/${test.campaign}/${test.subject}`
                )
                .add(testToFinish)
                .then(() => {
                  return testToFinish.finished;
                });
            });
        }
      });
  }
);

/*
  finishTestCallable({client: "mockClient", campaign: "mockCampaign",subject: "mockSubject"})
*/
