import { useEffect, useMemo, useState } from 'react';
import {
  getLessonV2,
  listNativeV2LessonIds
} from '../../content/registry';
import {
  getLearningProgress,
  migrateLegacyProgress
} from '../../lib/learningProgress';
import { getWeakConcepts } from '../../lib/mastery';
import {
  getDueReviewCards,
  getNextReviewCard,
  getReviewStats,
  rateReviewCard,
  seedLessonReviewCards,
  type ReviewRating,
  type StoredReviewCard
} from '../../lib/reviewEngine';
import './learning-insights.css';

export function LearningInsights() {
  const [revision, setRevision] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    migrateLegacyProgress();

    for (const lessonId of listNativeV2LessonIds()) {
      const lesson = getLessonV2(lessonId);
      if (lesson) seedLessonReviewCards(lesson);
    }

    setRevision(value => value + 1);
  }, []);

  const stats = useMemo(() => getReviewStats(), [revision]);
  const dueCards = useMemo(() => getDueReviewCards(new Date(), 20), [revision]);
  const nextCard = dueCards[0] ?? null;
  const futureCard = useMemo(
    () => (dueCards.length ? null : getNextReviewCard()),
    [revision, dueCards.length]
  );
  const weakConcepts = useMemo(() => getWeakConcepts(10), [revision]);
  const progress = useMemo(() => getLearningProgress(), [revision]);

  const rate = (card: StoredReviewCard, rating: ReviewRating) => {
    rateReviewCard(card.id, rating);
    setRevealed(false);
    setRevision(value => value + 1);
  };

  const lessonsWithProgress = Object.entries(progress)
    .map(([lessonId, item]) => ({
      lessonId: Number(lessonId),
      item
    }))
    .filter(({ lessonId, item }) => Number.isInteger(lessonId) &&
      Boolean(
        item.visitedSectionIds.length ||
          item.completedActivityIds.length ||
          item.completedLabStepIds.length ||
          item.quizHistory.length
      )
    )
    .sort(
      (a, b) =>
        new Date(b.item.lastSeenAt).getTime() -
        new Date(a.item.lastSeenAt).getTime()
    )
    .slice(0, 6);

  return (
    <section className="learning-insights">
      <div className="learning-insights-head">
        <div>
          <span className="eyebrow">RETENÇÃO E DOMÍNIO</span>
          <h2>Revisar o que está vencendo, não repetir tudo</h2>
          <p>
            O progresso continua local neste dispositivo. O scheduler usa FSRS e
            os erros de quiz/jogos alimentam conceitos fracos.
          </p>
        </div>
        <div className="learning-insights-stats">
          <span>
            <strong>{stats.due}</strong>
            vencendo agora
          </span>
          <span>
            <strong>{stats.reviewed}</strong>
            já revisados
          </span>
        </div>
      </div>

      <div className="learning-insights-grid">
        <article className="spaced-review-card">
          <span className="eyebrow">FSRS · REVISÃO ESPAÇADA</span>
          {nextCard ? (
            <>
              <div className="spaced-review-meta">
                <span>Aula {nextCard.lessonId}</span>
                <span>{nextCard.conceptId}</span>
              </div>
              <h3>{nextCard.prompt}</h3>

              {!revealed ? (
                <button
                  className="button primary"
                  onClick={() => setRevealed(true)}
                >
                  Mostrar resposta
                </button>
              ) : (
                <>
                  <div className="spaced-review-answer">
                    <p>{nextCard.answer}</p>
                  </div>
                  <p className="spaced-review-question">
                    Quanto esforço foi necessário para recuperar isso?
                  </p>
                  <div className="spaced-review-ratings">
                    <button onClick={() => rate(nextCard, 'again')}>Errei</button>
                    <button onClick={() => rate(nextCard, 'hard')}>Difícil</button>
                    <button onClick={() => rate(nextCard, 'good')}>Bom</button>
                    <button onClick={() => rate(nextCard, 'easy')}>Fácil</button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="spaced-review-empty">
              <strong>Nada vencendo agora.</strong>
              <p>
                {futureCard
                  ? `Próxima revisão: ${formatDate(futureCard.card.due)}`
                  : 'Os cartões aparecem quando uma aula V2 possui flashcards.'}
              </p>
            </div>
          )}
        </article>

        <article className="mastery-card">
          <span className="eyebrow">CONCEITOS FRACOS</span>
          <h3>Prioridade de revisão</h3>
          {weakConcepts.length ? (
            <div className="mastery-list">
              {weakConcepts.map(concept => (
                <div key={concept.conceptId}>
                  <div>
                    <strong>{concept.label}</strong>
                    <small>
                      {concept.incorrectEvidence} evidência(s) de erro
                    </small>
                  </div>
                  <span>{concept.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">
              Ainda não há evidência suficiente para classificar conceitos
              fracos.
            </p>
          )}
        </article>
      </div>

      {lessonsWithProgress.length > 0 && (
        <article className="granular-progress-card">
          <div>
            <span className="eyebrow">PROGRESSO GRANULAR</span>
            <h3>Atividade recente</h3>
          </div>
          <div className="granular-progress-list">
            {lessonsWithProgress.map(({ lessonId, item }) => (
              <a href={`#lesson/${lessonId}`} key={lessonId}>
                <b>{lessonId}</b>
                <span>
                  <strong>{item.visitedSectionIds.length} seções</strong>
                  <small>
                    {item.completedActivityIds.length} práticas ·{' '}
                    {item.completedLabStepIds.length} checkpoints ·{' '}
                    {item.quizHistory.length} quizzes
                  </small>
                </span>
              </a>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
