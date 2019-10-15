import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";
import { AnswerEndPoint, QuestionAnswered } from "./types/questions.interface";
import { getRandomQuestion, getFilterQuestions } from "./test.helper";
import { TestInProgress } from "./types";

export const answerQuestionCallable = functions.https.onCall(
  (answer: AnswerEndPoint, context: functions.https.CallableContext) => {
    const uid = Auth.getUid(context);
    const db = admin.firestore();

    if (!answer.client || !answer.campaign || !answer.subject || !answer.id) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The client, campaign, subject or answer value arguments were not set"
      );
    }

    return db
      .doc(
        `client/${answer.client}/campaign/${answer.campaign}/user/${uid}/test/${answer.subject}`
      )
      .get()
      .then(test => {
        const data = test.data();

        if (data && !(data as TestInProgress).lastSendQuestion) {
          throw new functions.https.HttpsError(
            "not-found",
            `The test "${answer.client}-${answer.campaign}-${answer.subject}" for the user ${uid} has not questions waiting for an answer`
          );
        } else if (data) {
          const testInProgress = data as TestInProgress;
          const lastSendQuestionId = testInProgress.lastSendQuestion.id;
          // Set the answer to the lastSendQuestion
          testInProgress.question.forEach(question => {
            if (question.id === lastSendQuestionId) {
              /// CHECK if the answer is x  valid
              const matchIdAnswer = question.answers.find(
                possibleAnswer => possibleAnswer.id === answer.id
              );
              if (matchIdAnswer) {
                (question as QuestionAnswered).answer = matchIdAnswer;
              } else {
                throw new functions.https.HttpsError(
                  "invalid-argument",
                  `The answer ID "${answer.id}" is not valid for the question "${question.value}"`
                );
              }
            }
          });
          // Review if already answered the minimum amount of questions
          testInProgress.canFinish =
            testInProgress.requiredAmountAnswers <=
            getFilterQuestions(testInProgress.question, true).length;

          // Update the last send question with a new one
          testInProgress.lastSendQuestion = {
            optional: testInProgress.canFinish,
            ...getRandomQuestion(testInProgress.question)
          };
          testInProgress.lastSendQuestion.optional = testInProgress.canFinish;

          // Save the questions with the answer and the new asked question
          return db
            .doc(
              `client/${answer.client}/campaign/${answer.campaign}/user/${uid}/test/${answer.subject}`
            )
            .update(testInProgress)
            .then(() => {
              // Return the new asked question
               delete testInProgress.lastSendQuestion.expectedAnswerId;
               return testInProgress.lastSendQuestion
            })
            .catch(() => {
              throw new functions.https.HttpsError(
                "not-found",
                "There was a problem saving your answer"
              );
            });
        } else {
          throw new functions.https.HttpsError(
            "not-found",
            `The test "${answer.client}-${answer.campaign}-${answer.subject}" for the user ${uid} was not found, did you start it?`
          );
        }
      });
  }
);

/*
  answerQuestionCallable({client: "mockClient", campaign: "mockCampaign",subject: "mockSubject", id: "1"})
*/
