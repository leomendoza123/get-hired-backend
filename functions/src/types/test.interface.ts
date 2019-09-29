import { Question } from "./questions.interface";

export interface TestBase {
  client: string;
  campaign: string;
  subject: string;
}

export interface TestDefinition extends TestBase {
  question: Question[];
}

export interface Test extends TestDefinition {
  finished?: boolean;
  lastSendQuestion?: Question;
  score?: number;
  startDate: Date;
  finishDate?: Date;
}
