import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { ToastProvider } from './components/ui/Toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import TemplateDemo from './pages/TemplateDemo'
import DragDropDemo from './pages/DragDropDemo'
import ResumeAnalysis from './pages/ResumeAnalysis'
import JobMatching from './pages/JobMatching'
import WorkInProgress from './pages/WorkInProgress'
import NotFound from './pages/NotFound'
// import ResumeEditor from './pages/ResumeEditor'
import ErrorBoundary from './components/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <DarkModeProvider>
          <AuthProvider>
            <ToastProvider>
              <Layout />
            </ToastProvider>
          </AuthProvider>
        </DarkModeProvider>
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'templates', element: <TemplateDemo /> },
      { path: 'drag-drop', element: <DragDropDemo /> },
      { path: 'analysis', element: <ResumeAnalysis /> },
      { path: 'job-matching', element: <JobMatching /> },
      { path: 'editor', element: <WorkInProgress /> },
      { path: 'work-in-progress', element: <WorkInProgress /> },
      // Resume editor disabled - focusing on core analysis features
      // { path: 'editor/:resumeId', element: <ResumeEditor /> },
      // 404 catch-all route
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App