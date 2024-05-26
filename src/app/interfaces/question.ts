export interface Category {
  "name": string,
  "count_questions": number,
  "link": string
}
 
export interface IResponseGetCategories {
  "totalCategories": number,
  "totalQuestions": number,
  "categories": Category[]
}

export interface IQuestion {
  id:             string;
  category:       string;
  level:          string;
  question:       string;
  answers:        Answers;
  correct_answer: string;
  feedback: string;
}

export interface Answers {
  answer_a: string;
  answer_b?: string;
  answer_c?: string;
  answer_d?: string;
}
