import {
  QuestionDefinition,
  MightBeAnsweredOrJustDefine,
  QuestionAsked
} from "./questions.interface";

export interface CreateTestEndpoint {
  client: string;
  campaign: string;
  subject: string;
  question: QuestionDefinition[];
  requiredAmountAnswers: number;
}

export interface TestInProgress extends CreateTestEndpoint {
  question: MightBeAnsweredOrJustDefine[];
  lastSendQuestion: QuestionAsked;
  startDate: Date;
  canFinish: boolean;
}

export interface TestFinished extends CreateTestEndpoint {
  finished: Date;
  score: number;
  startDate: Date;
}

export interface StartTestEndpoint {
  client: string;
  campaign: string;
  subject: string;
}
