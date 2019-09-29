export interface Answer {
    id: string;
    uiId?: number;
    value: string;
}

export interface Question {
    id: string;
    value: string;
    answers: Answer[];
    answer?: Answer;
    optional?: boolean;
    askedIndex?: number;
}
