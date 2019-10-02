import {
  QuestionDefinition,
  MightBeAnsweredOrJustDefine,
  QuestionAsked
} from "./questions.interface";

export interface CreateTestEndpoint {
  client: string;
  campaign: string;
  subject: string;
}

export interface TestDefinition extends CreateTestEndpoint {
  question: QuestionDefinition[];
  requiredAmountAnswers: number;
}

export interface TestInProgress extends TestDefinition {
  question: MightBeAnsweredOrJustDefine[];
  lastSendQuestion: QuestionAsked;
  startDate: Date;
  canFinish: boolean;
}

export interface TestFinished extends TestDefinition {
  finished: Date;
  score: number;
  startDate: Date;
}
