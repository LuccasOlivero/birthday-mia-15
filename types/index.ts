export default interface Invitado {
  nombre: string;
  apellido: string;
  esMenor: boolean | null;
}

export type Option = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  question: string;
  options: Option[];
};
