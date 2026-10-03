#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { api, ApiError } from './api.js'

interface TopicProgress {
  percent: number
  mastery: number | null
  needsReview: boolean
  pendingReviews: number
  questionsPassed: number
  questionsTotal: number
  resourcesDone: number
  resourcesTotal: number
  openTasks: number
}

interface Topic {
  id: number
  title: string
  category: string
  summary: string | null
  status: string
  understanding: number | null
  notes: string | null
  progress: TopicProgress
}

const server = new McpServer(
  { name: 'cyberpath', version: '0.1.0' },
  {
    instructions: [
      'CyberPath is the user\'s cybersecurity learning tracker (roadmap, tasks, journal, questions).',
      'When the user finishes a topic or asks to be quizzed: check get_progress_overview,',
      'read existing questions and notes with get_topic, then add non-repeating conceptual questions with add_question.',
      'Questions must be conceptual and defense-oriented (what, why, how to prevent); no attack payloads or step-by-step exploitation.',
      'Fetch open-ended answers with list_pending_answers and grade them with grade_answer, giving short, instructive and encouraging feedback.',
      'Write questions and feedback in the language the user writes in (match the existing questions if unsure).',
    ].join(' '),
  },
)

const text = (value: unknown) => ({
  content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
})

/** Turns API errors into a tool error result. */
const tool = <A>(handler: (args: A) => Promise<unknown>) => async (args: A) => {
  try {
    return text(await handler(args))
  } catch (error) {
    const message = error instanceof ApiError ? error.message : String(error)
    return { ...text(message), isError: true }
  }
}

server.registerTool(
  'get_progress_overview',
  {
    title: 'Progress overview',
    description: 'Overall stats (weekly minutes, streak, quiz accuracy, pending reviews) and the status of every topic.',
    inputSchema: {},
  },
  tool(async () => {
    const [dashboard, topics] = await Promise.all([
      api<Record<string, unknown>>('/dashboard'),
      api<Topic[]>('/topics'),
    ])
    const { activity: _activity, ...stats } = dashboard
    return {
      stats,
      topics: topics.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        status: t.status,
        understanding: t.understanding,
        ...t.progress,
      })),
    }
  }),
)

server.registerTool(
  'get_topic',
  {
    title: 'Topic details',
    description: 'A topic\'s summary, notes, resources, tasks and existing questions (with their latest attempts).',
    inputSchema: { topicId: z.number().int().positive() },
  },
  tool(async ({ topicId }: { topicId: number }) => {
    const [topic, resources, tasks, questions] = await Promise.all([
      api<Topic>(`/topics/${topicId}`),
      api<unknown[]>(`/topics/${topicId}/resources`),
      api<unknown[]>(`/tasks?scope=ALL&topicId=${topicId}`),
      api<unknown[]>(`/topics/${topicId}/questions`),
    ])
    return { topic, resources, tasks, questions }
  }),
)

server.registerTool(
  'add_question',
  {
    title: 'Add question',
    description:
      'Adds a comprehension-check question to a topic. MULTIPLE_CHOICE requires 2-6 options and a 0-based correctIndex. ' +
      'For OPEN, put the outline of the expected answer in explanation (used when grading). The question is labelled "Claude" in the UI. Write questions in the same language as the topic\'s existing questions.',
    inputSchema: {
      topicId: z.number().int().positive(),
      prompt: z.string().min(5).max(2000),
      kind: z.enum(['MULTIPLE_CHOICE', 'OPEN']),
      options: z.array(z.string().min(1).max(500)).min(2).max(6).optional(),
      correctIndex: z.number().int().min(0).optional(),
      explanation: z.string().max(4000).optional(),
    },
  },
  tool(async ({ topicId, ...question }: { topicId: number; prompt: string; kind: string; options?: string[]; correctIndex?: number; explanation?: string }) =>
    api(`/topics/${topicId}/questions`, { method: 'POST', body: { ...question, source: 'CLAUDE' } }),
  ),
)

server.registerTool(
  'list_pending_answers',
  {
    title: 'Pending answers',
    description: 'The user\'s ungraded answers to open-ended questions, with the question and the expected outline.',
    inputSchema: {},
  },
  tool(async () => {
    const pending = await api<unknown[]>('/attempts/pending')
    return pending.length ? pending : 'No answers are waiting to be graded.'
  }),
)

server.registerTool(
  'grade_answer',
  {
    title: 'Grade answer',
    description: 'Marks an open-ended answer as correct/incorrect and stores the feedback shown to the user.',
    inputSchema: {
      attemptId: z.number().int().positive(),
      correct: z.boolean(),
      feedback: z.string().min(1).max(4000).describe('Short, instructive feedback in the user\'s language: what was right, what is missing, the next step.'),
    },
  },
  tool(async ({ attemptId, correct, feedback }: { attemptId: number; correct: boolean; feedback: string }) =>
    api(`/attempts/${attemptId}/grade`, { method: 'PATCH', body: { correct, feedback } }),
  ),
)

server.registerTool(
  'add_task',
  {
    title: 'Add task',
    description: 'Adds a task to the user\'s task list (optional topic and due date, YYYY-MM-DD).',
    inputSchema: {
      title: z.string().min(1).max(300),
      topicId: z.number().int().positive().optional(),
      dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    },
  },
  tool(async (input: { title: string; topicId?: number; dueDate?: string }) => api('/tasks', { method: 'POST', body: input })),
)

server.registerTool(
  'add_resource',
  {
    title: 'Add resource',
    description: 'Adds a study resource to a topic (course, video, lab, doc, book).',
    inputSchema: {
      topicId: z.number().int().positive(),
      title: z.string().min(1).max(200),
      url: z.string().url().optional(),
      kind: z.enum(['COURSE', 'VIDEO', 'LAB', 'DOC', 'BOOK']),
    },
  },
  tool(async ({ topicId, ...input }: { topicId: number; title: string; url?: string; kind: string }) =>
    api(`/topics/${topicId}/resources`, { method: 'POST', body: input }),
  ),
)

server.registerTool(
  'create_topic',
  {
    title: 'Create topic',
    description: 'Adds a new topic to the roadmap.',
    inputSchema: {
      title: z.string().min(1).max(200),
      category: z.enum(['FUNDAMENTALS', 'NETWORK', 'CRYPTO', 'WEB', 'DEFENSE', 'CLOUD', 'PRACTICE']),
      summary: z.string().max(2000).optional(),
    },
  },
  tool(async (input: { title: string; category: string; summary?: string }) => api('/topics', { method: 'POST', body: input })),
)

server.registerTool(
  'update_topic_status',
  {
    title: 'Update topic status',
    description: 'Changes a topic\'s status. Do not use unless the user explicitly asks.',
    inputSchema: {
      topicId: z.number().int().positive(),
      status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
    },
  },
  tool(async ({ topicId, status }: { topicId: number; status: string }) =>
    api(`/topics/${topicId}`, { method: 'PATCH', body: { status } }),
  ),
)

server.registerTool(
  'list_journal',
  {
    title: 'Study journal',
    description: 'Journal entries from the last N days (what was learned, struggles, next goal).',
    inputSchema: { days: z.number().int().min(1).max(365).default(14) },
  },
  tool(async ({ days }: { days: number }) => {
    const to = new Date()
    const from = new Date(to.getTime() - days * 86_400_000)
    const iso = (d: Date) => d.toISOString().slice(0, 10)
    return api(`/journal?from=${iso(from)}&to=${iso(to)}`)
  }),
)

await server.connect(new StdioServerTransport())
