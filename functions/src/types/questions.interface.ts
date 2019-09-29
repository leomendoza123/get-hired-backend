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

export interface Question {
  id: string;
  value: string;
  answers: Answer[];
  answer?: Answer;
  optional?: boolean;
  askedIndex?: number;
}
