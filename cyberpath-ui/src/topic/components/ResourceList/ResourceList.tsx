import { useState, type FormEvent } from 'react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Input, Select } from '@/components/Field'
import { Loader } from '@/components/Loader'
import { errorMessage } from '@/modules/axios'
import { cn } from '@/utils/cn'
import { RESOURCE_KIND_ICONS, RESOURCE_KIND_LABELS } from '../../constants'
import { useCreateResourceMutation, useDeleteResourceMutation, useResourcesQuery, useToggleResourceMutation } from '../../hooks/useResources'
import type { ResourceKind } from '../../types'
import styles from './ResourceList.module.css'

const hostOf = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

export const ResourceList = ({ topicId }: { topicId: number }) => {
  const { data: resources, isLoading } = useResourcesQuery(topicId)
  const toggle = useToggleResourceMutation()
  const remove = useDeleteResourceMutation()
  const create = useCreateResourceMutation(topicId)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [kind, setKind] = useState<ResourceKind>('COURSE')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    create.mutate(
      { title: title.trim(), url: url.trim() || undefined, kind },
      { onSuccess: () => { setTitle(''); setUrl('') } },
    )
  }

  if (isLoading) return <Loader />

  return (
    <div className={styles.wrapper}>
      {resources?.length ? (
        <ul className={styles.list}>
          {resources.map((r) => (
            <li key={r.id} className={cn(styles.item, r.done && styles.done)}>
              <input
                type="checkbox"
                className={styles.check}
                checked={r.done}
                onChange={() => toggle.mutate({ id: r.id, done: !r.done })}
                aria-label={`${r.title} done`}
              />
              <span className={styles.icon}>{RESOURCE_KIND_ICONS[r.kind]}</span>
              <div className={styles.body}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.title}>{r.title} ↗</a>
                ) : (
                  <span className={styles.title}>{r.title}</span>
                )}
                {r.url && <span className={styles.url}>{hostOf(r.url)}</span>}
              </div>
              <Badge>{RESOURCE_KIND_LABELS[r.kind]}</Badge>
              <Button size="sm" variant="danger" onClick={() => remove.mutate(r.id)} aria-label="Delete">×</Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon="▣" title="No resources yet" description="Add where you will study this topic: a course, video, lab or docs." />
      )}

      <form className={styles.form} onSubmit={submit}>
        <Input placeholder="Resource name" value={title} onChange={(e) => setTitle(e.target.value)} wrapperClassName={styles.grow} required />
        <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} wrapperClassName={styles.grow} type="url" />
        <Select value={kind} onChange={(e) => setKind(e.target.value as ResourceKind)}>
          {(Object.keys(RESOURCE_KIND_LABELS) as ResourceKind[]).map((k) => (
            <option key={k} value={k}>{RESOURCE_KIND_LABELS[k]}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary" disabled={!title.trim() || create.isPending}>+ Add</Button>
      </form>
      {create.isError && <p className={styles.error}>{errorMessage(create.error)}</p>}
    </div>
  )
}
