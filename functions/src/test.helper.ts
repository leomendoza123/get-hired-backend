import * as functions from "firebase-functions";
import {
  MightBeAnsweredOrJustDefine,
  QuestionAnswered,
  QuestionDefinition
} from "./types";

export function getRandomQuestion(
  questions: MightBeAnsweredOrJustDefine[]
): QuestionDefinition {
  const nonAskQuestions = getFilterQuestions(questions);
  if (nonAskQuestions.length === 0) {
    throw new functions.https.HttpsError(
      "out-of-range",
      `The test has no more questions.`
    );
  }
  return nonAskQuestions[Math.floor(Math.random() * nonAskQuestions.length)];
}

export function getFilterQuestions(
  questions: MightBeAnsweredOrJustDefine[],
  answered = false
): MightBeAnsweredOrJustDefine[] {
  const nonAskQuestions = questions.filter(questionDefinition =>
    answered
      ? (questionDefinition as QuestionAnswered).answer
      : !(questionDefinition as QuestionAnswered).answer
  );
  return nonAskQuestions;
}
