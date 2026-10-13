import fs from 'node:fs';
import path from 'node:path';

export function validateLesson(lesson, referenceCatalog = new Set()) {
  const errors = [];
  const fail = message => errors.push(`Aula ${lesson?.id ?? '?'}: ${message}`);

  if (!lesson || typeof lesson !== 'object') {
    return ['Aula ?: documento JSON inválido.'];
  }

  if (lesson.schemaVersion !== 2) fail('schemaVersion deve ser 2.');
  if (!Number.isInteger(lesson.id) || lesson.id <= 0) fail('id deve ser inteiro positivo.');
  if (!lesson.slug || typeof lesson.slug !== 'string') fail('slug obrigatório.');
  if (!lesson.title || typeof lesson.title !== 'string') fail('title obrigatório.');
  if (!lesson.track || typeof lesson.track !== 'string') fail('track obrigatório.');
  if (!['Base', 'Intermediário', 'Avançado'].includes(lesson.level)) fail('level inválido.');
  if (!Number.isInteger(lesson.durationMin) || lesson.durationMin <= 0) fail('durationMin deve ser inteiro positivo.');
  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 1) fail('objectives precisa ter pelo menos um item.');

  if (!Array.isArray(lesson.recommendedPrerequisites)) {
    fail('recommendedPrerequisites deve ser array.');
  } else {
    for (const prerequisite of lesson.recommendedPrerequisites) {
      if (prerequisite.blocking !== false) {
        fail(`pré-requisito "${prerequisite.title ?? '?'}" não pode ser bloqueador.`);
      }
    }
  }

  if (!lesson.problem?.title || !lesson.problem?.scenario) fail('problem precisa de title e scenario.');

  if (!Array.isArray(lesson.fundamentals) || lesson.fundamentals.length < 1) {
    fail('fundamentals precisa ter pelo menos um conceito.');
  }

  const mechanismSteps = lesson.mechanism?.steps;
  if (!Array.isArray(mechanismSteps) || mechanismSteps.length < 1) {
    fail('mechanism.steps precisa ter pelo menos uma etapa.');
  } else {
    validateUniqueIds(mechanismSteps, 'mechanism.steps', fail);
  }

  if (!Array.isArray(lesson.workedExamples)) fail('workedExamples deve ser array.');
  else validateUniqueIds(lesson.workedExamples, 'workedExamples', fail);

  if (!Array.isArray(lesson.completionExercises)) fail('completionExercises deve ser array.');
  else validateUniqueIds(lesson.completionExercises, 'completionExercises', fail);

  if (!Array.isArray(lesson.independentExercises)) fail('independentExercises deve ser array.');
  else validateUniqueIds(lesson.independentExercises, 'independentExercises', fail);

  if (!Array.isArray(lesson.codeExamples)) fail('codeExamples deve ser array.');
  else validateUniqueIds(lesson.codeExamples, 'codeExamples', fail);

  if (lesson.lab) {
    if (!lesson.lab.title || !lesson.lab.mode || !lesson.lab.safetyScope) {
      fail('lab precisa de title, mode e safetyScope.');
    }
    if (!Array.isArray(lesson.lab.steps) || lesson.lab.steps.length < 1) {
      fail('lab.steps precisa ter pelo menos um passo.');
    } else {
      validateUniqueIds(lesson.lab.steps, 'lab.steps', fail);
      for (const step of lesson.lab.steps) {
        if (!step.instruction) fail(`lab step ${step.id ?? '?'} sem instruction.`);
        if (!step.expected) fail(`lab step ${step.id ?? '?'} sem expected.`);
        if (!step.checkpoint) fail(`lab step ${step.id ?? '?'} sem checkpoint.`);
      }
    }
  }

  if (!Array.isArray(lesson.detection?.signals) || lesson.detection.signals.length < 1) {
    fail('detection.signals precisa ter pelo menos um sinal.');
  }

  if (!Array.isArray(lesson.remediation?.principles) || lesson.remediation.principles.length < 1) {
    fail('remediation.principles precisa ter pelo menos um princípio.');
  }

  const quiz = lesson.review?.quiz;
  const deepLesson = Number(lesson.durationMin) >= 45;
  if (!Array.isArray(quiz) || quiz.length < 1) {
    fail('review.quiz precisa ter pelo menos uma questão.');
  } else {
    quiz.forEach((question, index) => {
      if (!question.q) fail(`quiz[${index}] sem enunciado.`);
      if (!Array.isArray(question.options) || question.options.length < 2) {
        fail(`quiz[${index}] precisa de pelo menos duas opções.`);
      } else {
        const normalized = question.options.map(value => String(value).trim().toLowerCase());
        if (new Set(normalized).size !== normalized.length) {
          fail(`quiz[${index}] contém opções duplicadas.`);
        }
      }
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= (question.options?.length ?? 0)) {
        fail(`quiz[${index}] possui answer fora do intervalo.`);
      }
      if (!question.why) fail(`quiz[${index}] sem explicação why.`);
      if (!question.concept) fail(`quiz[${index}] sem concept.`);

      if (/qual (?:afirmação|opção).*(?:resume|descreve).*aula/i.test(question.q)) {
        fail(`quiz[${index}] usa enunciado genérico em vez de testar mecanismo.`);
      }
    });

    if (deepLesson && quiz.length < 5) {
      fail('aula profunda precisa de pelo menos 5 questões específicas.');
    }
  }

  const flashcards = lesson.review?.flashcards;
  if (!Array.isArray(flashcards) || flashcards.length < 1) {
    fail('review.flashcards precisa ter pelo menos um cartão.');
  } else {
    const fronts = flashcards.map(card => String(card.front || '').trim().toLowerCase());
    if (new Set(fronts).size !== fronts.length) {
      fail('review.flashcards contém frentes duplicadas.');
    }
    if (deepLesson && flashcards.length < 6) {
      fail('aula profunda precisa de pelo menos 6 flashcards.');
    }
    flashcards.forEach((card, index) => {
      if (!card.front || !card.back || !card.concept) {
        fail(`flashcard[${index}] precisa de front, back e concept.`);
      }
    });
  }

  if (!Array.isArray(lesson.externalReferences)) {
    fail('externalReferences deve ser array.');
  } else {
    for (const ref of lesson.externalReferences) {
      if (!ref.catalogId) fail('externalReference sem catalogId.');
      else if (referenceCatalog.size && !referenceCatalog.has(ref.catalogId)) {
        fail(`externalReference aponta para catalogId inexistente: ${ref.catalogId}.`);
      }
    }
  }

  return errors;
}

function validateUniqueIds(items, label, fail) {
  const ids = items.map(item => item?.id).filter(Boolean);
  if (ids.length !== items.length) fail(`${label} contém item sem id.`);
  const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicated.length) fail(`${label} contém ids duplicados: ${[...new Set(duplicated)].join(', ')}.`);
}

export function listLessonJsonFiles(rootDir) {
  const result = [];
  if (!fs.existsSync(rootDir)) return result;

  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name === 'lesson.json') result.push(full);
    }
  };

  walk(rootDir);
  return result.sort();
}

export function extractLegacyLessonIds(sourceText) {
  const ids = [];
  const regex = /["']?id["']?\s*:\s*(\d+)\s*,/g;
  let match;
  while ((match = regex.exec(sourceText)) !== null) ids.push(Number(match[1]));
  return ids;
}
