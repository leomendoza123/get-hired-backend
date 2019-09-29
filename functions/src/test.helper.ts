import { Question } from "./types";
import * as functions from "firebase-functions";

export function getRandomQuestion(questions: Question[]) {
  const nonAskQuestions = questions.filter(
    questionDefinition => !questionDefinition.answer
  );
  if (nonAskQuestions.length === 0) {
    throw new functions.https.HttpsError(
      "out-of-range",
      `The test has no more questions.`
    );
  }
  return nonAskQuestions[Math.floor(Math.random() * nonAskQuestions.length)];
}
