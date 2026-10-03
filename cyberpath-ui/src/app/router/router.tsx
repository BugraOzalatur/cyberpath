import { createBrowserRouter } from 'react-router'
import { MainLayout } from '@/app/layouts/MainLayout'
import { DashboardPage } from '@/dashboard/pages/DashboardPage'
import { ExamPage } from '@/exam/pages/ExamPage'
import { JournalPage } from '@/journal/pages/JournalPage'
import { TasksPage } from '@/task/pages/TasksPage'
import { TopicDetailPage } from '@/topic/pages/TopicDetailPage'
import { TopicsPage } from '@/topic/pages/TopicsPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'topics', element: <TopicsPage /> },
      { path: 'topics/:topicId', element: <TopicDetailPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'exam', element: <ExamPage /> },
    ],
  },
])
