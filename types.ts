export enum ViewMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  SOLVER = 'SOLVER',
  QUIZ = 'QUIZ'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 string
  isError?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizState {
  isActive: boolean;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  showResult: boolean;
  selectedOption: number | null;
  loading: boolean;
}

export enum PhysicsTopic {
  MECHANICS = 'Cơ học',
  THERMODYNAMICS = 'Nhiệt học',
  ELECTROMAGNETISM = 'Điện từ học',
  OPTICS = 'Quang học',
  QUANTUM = 'Vật lý lượng tử',
  RELATIVITY = 'Thuyết tương đối'
}