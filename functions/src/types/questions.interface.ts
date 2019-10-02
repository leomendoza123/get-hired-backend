export interface Answer {
  id: string;
  value: string;
}

export interface AnswerEndPoint {
  campaign: string;
  client: string;
  subject: string;
  id: string;
}

export interface QuestionDefinition {
  id: string;
  value: string;
  answers: Answer[];
  expectedAnswerId: string;
}

export interface QuestionAsked extends QuestionDefinition {
  optional: boolean
}

export interface QuestionAnswered extends QuestionAsked {
    answer: Answer
}

export type MightBeAnsweredOrJustDefine = QuestionAnswered | QuestionDefinition;
