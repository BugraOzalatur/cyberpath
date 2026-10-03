import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { Input, Select, Textarea } from '@/components/Field'
import { Modal } from '@/components/Modal'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/constants'
import { errorMessage } from '@/modules/axios'
import type { TopicCategory } from '@/types'
import { useCreateTopicMutation } from '../../hooks/useTopicMutations'
import styles from './CreateTopicModal.module.css'

export interface CreateTopicModalProps {
  open: boolean
  onClose: () => void
}

export const CreateTopicModal = ({ open, onClose }: CreateTopicModalProps) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TopicCategory>('FUNDAMENTALS')
  const [summary, setSummary] = useState('')
  const create = useCreateTopicMutation()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    create.mutate(
      { title: title.trim(), category, summary: summary.trim() || undefined },
      {
        onSuccess: () => {
          setTitle('')
          setSummary('')
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} title="Add a topic" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Active Directory Basics" required autoFocus />
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as TopicCategory)}>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </Select>
        <Textarea label="Short description" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What will you learn in this topic?" />
        {create.isError && <p className={styles.error}>{errorMessage(create.error)}</p>}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim() || create.isPending}>Add</Button>
        </div>
      </form>
    </Modal>
  )
}
