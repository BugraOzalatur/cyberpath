import { useState } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { useAnswerMutation } from '@/hooks'
import { errorMessage } from '@/modules/axios'
import type { AnswerResult, Question } from '@/types'
import { cn } from '@/utils/cn'
import styles from './QuestionCard.module.css'

export interface QuestionCardProps {
  question: Question
  index?: number
  /** practice: shows the previous attempt and allows retrying. exam: single answer. */
  mode?: 'practice' | 'exam'
  onResult?: (result: AnswerResult) => void
}

interface ShownResult {
  correct: boolean | null
  pending: boolean
  correctIndex: number | null
  explanation: string | null
  selectedIndex: number | null
  answerText: string | null
  feedback: string | null
}

const fromLastAttempt = (question: Question): ShownResult | null => {
  const last = question.lastAttempt
  if (!last) return null
  return {
    correct: last.correct,
    pending: last.pending,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    selectedIndex: last.selectedIndex,
    answerText: last.answerText,
    feedback: last.feedback,
  }
}

export const QuestionCard = ({ question, index, mode = 'practice', onResult }: QuestionCardProps) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [result, setResult] = useState<ShownResult | null>(() => (mode === 'practice' ? fromLastAttempt(question) : null))
  const answer = useAnswerMutation()
  const isChoice = question.kind === 'MULTIPLE_CHOICE'
  const canSubmit = isChoice ? selected !== null : answerText.trim().length > 0

  const submit = () => {
    const input = isChoice ? { selectedIndex: selected ?? undefined } : { answerText }
    answer.mutate(
      { questionId: question.id, input },
      {
        onSuccess: (res) => {
          setResult({ ...res, selectedIndex: selected, answerText: isChoice ? null : answerText, feedback: null })
          onResult?.(res)
        },
      },
    )
  }

  const retry = () => {
    setResult(null)
    setSelected(null)
    setAnswerText('')
  }

  const optionClass = (i: number) => {
    if (!result) return cn(styles.option, selected === i && styles.selected)
    if (i === result.correctIndex) return cn(styles.option, styles.correct)
    if (i === result.selectedIndex) return cn(styles.option, styles.wrong)
    return cn(styles.option, styles.dimmed)
  }

  return (
    <article className={cn(styles.card, result?.correct === true && styles.cardCorrect, result?.correct === false && styles.cardWrong)}>
      <header className={styles.header}>
        <span className={styles.index}>{index !== undefined ? `S${index + 1}` : '?'}</span>
        <div className={styles.badges}>
          <Badge tone={isChoice ? 'info' : 'violet'}>{isChoice ? 'Multiple choice' : 'Open-ended'}</Badge>
          {question.source === 'CLAUDE' && <Badge tone="violet">✦ Claude</Badge>}
          {result?.correct === true && <Badge tone="accent">✓ Correct</Badge>}
          {result?.correct === false && <Badge tone="danger">✗ Wrong</Badge>}
          {result?.pending && <Badge tone="warn">⏳ Awaiting review</Badge>}
        </div>
      </header>

      <p className={styles.prompt}>{question.prompt}</p>

      {isChoice ? (
        <div className={styles.options}>
          {question.options.map((option, i) => (
            <button key={i} className={optionClass(i)} disabled={!!result} onClick={() => setSelected(i)}>
              <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
      ) : result ? (
        <blockquote className={styles.answer}>{result.answerText}</blockquote>
      ) : (
        <textarea
          className={styles.textarea}
          placeholder="Answer in your own words. Claude will review it and give feedback."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />
      )}

      {result && (
        <div className={styles.result}>
          {result.feedback && (
            <p className={styles.feedback}>
              <strong>Claude:</strong> {result.feedback}
            </p>
          )}
          {result.pending && (
            <p className={styles.pendingNote}>
              Answer saved. Ask Claude Code to <code>review my answers</code>.
            </p>
          )}
          {result.explanation && (
            <p className={styles.explanation}>
              <strong>{isChoice ? 'Explanation:' : 'Expected key points:'}</strong> {result.explanation}
            </p>
          )}
        </div>
      )}

      {answer.isError && <p className={styles.error}>{errorMessage(answer.error)}</p>}

      <footer className={styles.footer}>
        {!result && (
          <Button size="sm" onClick={submit} disabled={!canSubmit || answer.isPending}>
            {answer.isPending ? 'Submitting…' : 'Submit answer'}
          </Button>
        )}
        {result && mode === 'practice' && (
          <Button size="sm" variant="secondary" onClick={retry}>
            Try again
          </Button>
        )}
      </footer>
    </article>
  )
}
