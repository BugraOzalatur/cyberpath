import { useState } from 'react'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/Field'
import styles from './TopicNotes.module.css'

export interface TopicNotesProps {
  notes: string | null
  saving: boolean
  onSave: (notes: string) => void
}

const TEMPLATE = `## What is it? (one sentence)

## Why does it matter / why does it happen?

## How is it prevented / done right?

## Summary in my own words

## Open questions (to ask Claude)
`

export const TopicNotes = ({ notes, saving, onSave }: TopicNotesProps) => {
  // The parent remounts this component via `key` when the saved notes change
  const [draft, setDraft] = useState(notes ?? '')
  const dirty = draft !== (notes ?? '')

  return (
    <div className={styles.wrapper}>
      <Textarea
        className={styles.editor}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Write what you learned about this topic in your own words…"
      />
      <div className={styles.actions}>
        {!draft && <Button variant="ghost" size="sm" onClick={() => setDraft(TEMPLATE)}>Use template</Button>}
        <span className={styles.status}>{saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'Saved'}</span>
        <Button size="sm" onClick={() => onSave(draft)} disabled={!dirty || saving}>Save</Button>
      </div>
    </div>
  )
}
