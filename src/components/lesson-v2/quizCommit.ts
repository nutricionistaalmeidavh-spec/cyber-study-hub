/** Selecionar uma alternativa não constitui uma tentativa registrada. */
export function canRevealQuizFeedback(confirmed: boolean): boolean {
  return confirmed;
}

export function quizActionLabel(confirmed: boolean, lastQuestion: boolean): string {
  if (!confirmed) return 'Conferir resposta';
  return lastQuestion ? 'Finalizar' : 'Próxima questão';
}
