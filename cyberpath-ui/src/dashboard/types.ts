export interface TopicBrief {
  id: number
  title: string
  percent: number
  mastery: number | null
}

export interface WeekStat {
  weekStart: string
  minutes: number
  entries: number
  tasksDone: number
}

export interface DayActivity {
  date: string
  minutes: number
}

export interface Dashboard {
  topicsTotal: number
  topicsCompleted: number
  topicsInProgress: number
  overallPercent: number
  minutesThisWeek: number
  minutesLastWeek: number
  streakDays: number
  tasksToday: number
  tasksOverdue: number
  quizAccuracy: number | null
  pendingReviews: number
  activeTopics: TopicBrief[]
  reviewTopics: TopicBrief[]
  weeks: WeekStat[]
  activity: DayActivity[]
}
