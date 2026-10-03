import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader } from '@/components/PageHeader'
import { ProgressBar } from '@/components/ProgressBar'
import { ProgressRing } from '@/components/ProgressRing'
import { QuestionCard } from '@/components/QuestionCard'
import { useTopicsQuery } from '@/hooks'
import { errorMessage } from '@/modules/axios'
import type { AnswerResult, Question } from '@/types'
import { cn } from '@/utils/cn'
import { useStartExamMutation } from '../../hooks/useStartExamMutation'
import styles from './ExamPage.module.css'

const SIZES = [5, 10, 15, 20]

const verdict = (score: number) => {
  if (score >= 90) return { title: 'Excellent! 🎯', text: 'You have mastered these topics. Move on to the next one.' }
  if (score >= 70) return { title: 'Good progress 👍', text: 'Solid foundation. Read the explanations of your mistakes and try again.' }
  if (score >= 50) return { title: 'Halfway there', text: 'Go back to the resources of the topics you missed and review your notes.' }
  return { title: 'Time to review', text: 'Study these topics again. Ask Claude for explanations and new questions.' }
}

export const ExamPage = () => {
  const { data: topics } = useTopicsQuery()
  const start = useStartExamMutation()
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [size, setSize] = useState(10)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<Record<number, AnswerResult>>({})

  const toggleTopic = (id: number) =>
    setSelectedTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  const begin = () =>
    start.mutate(
      { topicIds: selectedTopics, size },
      {
        onSuccess: (data) => {
          setQuestions(data)
          setCurrent(0)
          setResults({})
        },
      },
    )

  const reset = () => setQuestions(null)

  // Setup
  if (!questions) {
    return (
      <>
        <PageHeader eyebrow="> exam" title="Exam" subtitle="Random questions from the topics you pick. Instant feedback on each one and a score at the end." />
        <Card title="1. Pick topics" actions={<span className={styles.hint}>{selectedTopics.length ? `${selectedTopics.length} topics` : 'All topics if none selected'}</span>}>
          <div className={styles.chips}>
            {topics?.map((t) => (
              <button key={t.id} className={cn(styles.chip, selectedTopics.includes(t.id) && styles.chipActive)} onClick={() => toggleTopic(t.id)}>
                {t.title}
                <span className={styles.chipCount}>{t.progress.questionsTotal}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="2. Number of questions" className={styles.spaced}>
          <div className={styles.chips}>
            {SIZES.map((s) => (
              <button key={s} className={cn(styles.chip, size === s && styles.chipActive)} onClick={() => setSize(s)}>
                {s} questions
              </button>
            ))}
          </div>
        </Card>
        <div className={styles.startRow}>
          {start.isError && <span className={styles.error}>{errorMessage(start.error)}</span>}
          <Button onClick={begin} disabled={start.isPending}>⚑ Start exam</Button>
        </div>
      </>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="⚑"
          title="No multiple-choice questions for these topics"
          description={<>Ask Claude Code to <code>create multiple-choice questions for the selected topics</code>, then try again.</>}
          action={<Button variant="secondary" onClick={reset}>Go back</Button>}
        />
      </Card>
    )
  }

  const answered = Object.keys(results).length
  const finished = answered === questions.length && current >= questions.length

  // Result
  if (finished) {
    const correct = Object.values(results).filter((r) => r.correct).length
    const score = Math.round((correct / questions.length) * 100)
    const v = verdict(score)
    return (
      <>
        <PageHeader eyebrow="> exam.result" title="Exam result" />
        <Card className={styles.resultCard}>
          <div className={styles.result}>
            <ProgressRing value={score} size={150} label="score" />
            <div className={styles.resultText}>
              <h2 className={styles.verdict}>{v.title}</h2>
              <p className={styles.muted}><strong>{correct}</strong> of {questions.length} correct.</p>
              <p className={styles.muted}>{v.text}</p>
              <div className={styles.resultActions}>
                <Button onClick={begin}>Retake with same settings</Button>
                <Button variant="secondary" onClick={reset}>New exam</Button>
                <Link to="/topics"><Button variant="ghost">Roadmap →</Button></Link>
              </div>
            </div>
          </div>
        </Card>
        <h2 className={styles.reviewTitle}>Your answers</h2>
        <ul className={styles.review}>
          {questions.map((q, i) => {
            const r = results[q.id]
            return (
              <li key={q.id} className={cn(styles.reviewItem, r?.correct ? styles.ok : styles.bad)}>
                <span className={styles.mark}>{r?.correct ? '✓' : '✗'}</span>
                <div>
                  <p className={styles.reviewPrompt}>S{i + 1}. {q.prompt}</p>
                  {!r?.correct && r?.correctIndex !== null && r?.correctIndex !== undefined && (
                    <p className={styles.muted}>Correct answer: <strong>{q.options[r.correctIndex]}</strong></p>
                  )}
                  {r?.explanation && <p className={styles.explanation}>{r.explanation}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  // Exam in progress
  const question = questions[current]
  const hasAnswered = results[question.id] !== undefined
  return (
    <>
      <div className={styles.examHeader}>
        <span className={styles.counter}>Question {current + 1}/{questions.length}</span>
        <div className={styles.examProgress}>
          <ProgressBar value={(answered / questions.length) * 100} />
        </div>
        <Button size="sm" variant="ghost" onClick={reset}>Finish</Button>
      </div>
      <QuestionCard
        key={question.id}
        question={question}
        index={current}
        mode="exam"
        onResult={(r) => setResults((prev) => ({ ...prev, [question.id]: r }))}
      />
      <div className={styles.next}>
        <Button onClick={() => setCurrent((c) => c + 1)} disabled={!hasAnswered}>
          {current + 1 === questions.length ? 'See result →' : 'Next question →'}
        </Button>
      </div>
    </>
  )
}
