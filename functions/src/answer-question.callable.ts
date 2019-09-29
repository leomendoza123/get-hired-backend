import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Test } from "./types";
import { Auth } from "./auth.helper";
import { AnswerEndPoint } from "./types/questions.interface";
import { getRandomQuestion } from "./test.helper";

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
        const data: Test = test.data() as Test;

        if (data) {
          if (data.lastSendQuestion) {
            const lastSendQuestionId = data.lastSendQuestion.id;
            // Set the answer to the lastSendQuestion
            data.question.forEach(question => {
              if (question.id === lastSendQuestionId) {
                /// CHECK if the answer is valid
                const matchIdAnswer = question.answers.find(
                  possibleAnswer => possibleAnswer.id === answer.id
                );
                if (matchIdAnswer) {
                  question.answer = matchIdAnswer;
                } else {
                  throw new functions.https.HttpsError(
                    "invalid-argument",
                    `The answer ID "${answer.id}" is not valid for the question "${question.value}"`
                  );
                }
              }
            });
            // Update the last send question with a new one
            try {
              data.lastSendQuestion = getRandomQuestion(data.question);
            } catch {
              data.lastSendQuestion = undefined;
            }

            // Save the questions with the answer and the new asked question
            return db
              .doc(
                `client/${answer.client}/campaign/${answer.campaign}/user/${uid}/test/${answer.subject}`
              )
              .update({
                lastSendQuestion: data.lastSendQuestion
                  ? data.lastSendQuestion
                  : null,
                question: data.question
              })
              .then(() => {
                // Return the new asked question
                return data.lastSendQuestion;
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
              `The test "${answer.client}-${answer.campaign}-${answer.subject}" has not questions waiting for an answer`
            );
          }
        } else {
          throw new functions.https.HttpsError(
            "not-found",
            `The test "${answer.client}-${answer.campaign}-${answer.subject}" was not found, did you start it?`
          );
        }
      });
  }
);

/*
  answerQuestionCallable({client: "mockClient", campaign: "mockCampaign",subject: "mockSubject", id: "000"})
*/
