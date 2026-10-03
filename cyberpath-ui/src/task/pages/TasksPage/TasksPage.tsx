import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Input, Select } from '@/components/Field'
import { Loader } from '@/components/Loader'
import { PageHeader } from '@/components/PageHeader'
import { Tabs } from '@/components/Tabs'
import { useCreateTaskMutation, useDeleteTaskMutation, useTasksQuery, useTopicsQuery, useUpdateTaskMutation } from '@/hooks'
import { errorMessage } from '@/modules/axios'
import type { TaskScope } from '@/types'
import { cn } from '@/utils/cn'
import { formatDay, todayIso } from '@/utils/date'
import styles from './TasksPage.module.css'

export const TasksPage = () => {
  const [scope, setScope] = useState<TaskScope>('TODAY')
  const { data: tasks, isLoading, error } = useTasksQuery(scope)
  const { data: topics } = useTopicsQuery()
  const create = useCreateTaskMutation()
  const update = useUpdateTaskMutation()
  const remove = useDeleteTaskMutation()
  const [title, setTitle] = useState('')
  const [topicId, setTopicId] = useState('')
  const [dueDate, setDueDate] = useState(todayIso())
  const [hideDone, setHideDone] = useState(false)

  const topicTitles = useMemo(() => new Map((topics ?? []).map((t) => [t.id, t.title])), [topics])
  const visible = (tasks ?? []).filter((t) => !hideDone || !t.done)
  const doneCount = (tasks ?? []).filter((t) => t.done).length

  const submit = (event: FormEvent) => {
    event.preventDefault()
    create.mutate(
      { title: title.trim(), topicId: topicId ? Number(topicId) : null, dueDate: dueDate || null },
      { onSuccess: () => setTitle('') },
    )
  }

  return (
    <>
      <PageHeader eyebrow="> todo" title="Tasks" subtitle="Break big goals into small steps you can do today." />

      <Card className={styles.addCard}>
        <form className={styles.form} onSubmit={submit}>
          <Input label="Task" placeholder="e.g. PortSwigger: access control labs" value={title} onChange={(e) => setTitle(e.target.value)} wrapperClassName={styles.grow} required />
          <Select label="Topic" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="">— No topic —</option>
            {topics?.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </Select>
          <Input label="Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Button type="submit" disabled={!title.trim() || create.isPending}>+ Add</Button>
        </form>
        {create.isError && <p className={styles.error}>{errorMessage(create.error)}</p>}
      </Card>

      <div className={styles.toolbar}>
        <Tabs<TaskScope>
          active={scope}
          onChange={setScope}
          items={[
            { id: 'TODAY', label: 'Today' },
            { id: 'WEEK', label: 'This week' },
            { id: 'ALL', label: 'All' },
          ]}
        />
        <label className={styles.toggle}>
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
          Hide completed ({doneCount})
        </label>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorState error={error} />
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState icon="☑" title={scope === 'TODAY' ? 'Nothing due today' : 'No tasks'} description="Add a new task above." />
        </Card>
      ) : (
        <ul className={styles.list}>
          {visible.map((task) => (
            <li key={task.id} className={cn(styles.item, task.done && styles.done)}>
              <input
                type="checkbox"
                className={styles.check}
                checked={task.done}
                onChange={() => update.mutate({ id: task.id, input: { done: !task.done } })}
                aria-label={task.title}
              />
              <div className={styles.body}>
                <span className={styles.title}>{task.title}</span>
                {task.topicId && (
                  <Link to={`/topics/${task.topicId}`} className={styles.topic}>⌁ {topicTitles.get(task.topicId)}</Link>
                )}
              </div>
              {task.overdue && <Badge tone="danger">Overdue</Badge>}
              {task.dueDate && <span className={cn(styles.due, task.overdue && styles.overdue)}>{formatDay(task.dueDate)}</span>}
              <Button size="sm" variant="danger" onClick={() => remove.mutate(task.id)} aria-label="Sil">×</Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
