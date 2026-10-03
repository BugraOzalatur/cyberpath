import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/Field'
import { useCreateTaskMutation, useDeleteTaskMutation, useTasksQuery, useUpdateTaskMutation } from '@/hooks'
import { cn } from '@/utils/cn'
import { formatDay } from '@/utils/date'
import styles from './TopicTaskList.module.css'

export const TopicTaskList = ({ topicId }: { topicId: number }) => {
  const { data: tasks } = useTasksQuery('ALL', topicId)
  const create = useCreateTaskMutation()
  const update = useUpdateTaskMutation()
  const remove = useDeleteTaskMutation()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    create.mutate({ title: title.trim(), topicId, dueDate: dueDate || null }, { onSuccess: () => { setTitle(''); setDueDate('') } })
  }

  return (
    <div className={styles.wrapper}>
      {tasks?.length ? (
        <ul className={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} className={cn(styles.item, t.done && styles.done)}>
              <input type="checkbox" className={styles.check} checked={t.done} onChange={() => update.mutate({ id: t.id, input: { done: !t.done } })} aria-label={t.title} />
              <span className={styles.title}>{t.title}</span>
              {t.dueDate && <span className={cn(styles.due, t.overdue && styles.overdue)}>{formatDay(t.dueDate)}</span>}
              <Button size="sm" variant="danger" onClick={() => remove.mutate(t.id)} aria-label="Delete">×</Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon="☑" title="No tasks for this topic" description="Break the topic into small, doable steps. For example: “Bandit Level 5-10”." />
      )}
      <form className={styles.form} onSubmit={submit}>
        <Input placeholder="New task" value={title} onChange={(e) => setTitle(e.target.value)} wrapperClassName={styles.grow} required />
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Button type="submit" variant="secondary" disabled={!title.trim() || create.isPending}>+ Add</Button>
      </form>
    </div>
  )
}
