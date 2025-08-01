import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Stats, type StatItem } from '../components/ui/Stats'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload')

  const tabs = [
    { id: 'upload', name: 'Upload Resume', icon: '📄' },
    { id: 'analyze', name: 'Analyze Job', icon: '🔍' },
    { id: 'results', name: 'Results', icon: '📊' },
    { id: 'history', name: 'History', icon: '📈' }
  ]

  const statsData: StatItem[] = [
    {
      label: 'Resumes Analyzed',
      value: 3,
      change: { value: 12, type: 'increase' },
      icon: '📄',
      color: 'primary'
    },
    {
      label: 'Average Match Score',
      value: '87%',
      change: { value: 5, type: 'increase' },
      icon: '🎯',
      color: 'success'
    },
    {
      label: 'ATS Score',
      value: '92%',
      change: { value: 3, type: 'increase' },
      icon: '⚡',
      color: 'info'
    },
    {
      label: 'Improvements Made',
      value: 12,
      change: { value: 8, type: 'increase' },
      icon: '🚀',
      color: 'warning'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Optimize your resume with AI-powered insights
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Stats items={statsData} className="mb-8" />

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resume Analysis</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Button size="sm">
                New Analysis
              </Button>
              <Button size="sm" onClick={() => navigate('/editor')}>
                Create Resume
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'upload' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Upload your resume in PDF or DOCX format to get started with AI-powered analysis
                </p>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer block"
                  >
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      PDF, DOCX up to 10MB
                    </p>
                  </label>
                </div>
                <div className="mt-6">
                  <Button size="lg">
                    Start Analysis
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'analyze' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Job Description Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Paste a job description to analyze compatibility with your resume
                </p>
                <textarea
                  className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Paste a job description to analyze compatibility..."
                />
                <div className="mt-6">
                  <Button size="lg">
                    Analyze Compatibility
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card variant="outlined">
                    <CardContent className="text-center p-6">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                        87%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Overall Match Score
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent className="text-center p-6">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        92%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ATS Compatibility
                      </div>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent className="text-center p-6">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        15
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Keywords Matched
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Badge variant="warning">Medium</Badge>
                        <div>
                          <p className="font-medium">Add more quantifiable achievements</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Include specific metrics and numbers to demonstrate impact
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Badge variant="success">Low</Badge>
                        <div>
                          <p className="font-medium">Optimize for ATS keywords</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Include industry-specific keywords from the job description
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📄</div>
                    <div>
                      <p className="font-medium">Software Engineer - Google</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Analyzed on Dec 15, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      89%
                    </div>
                    <Badge variant="success">High Match</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">📄</div>
                    <div>
                      <p className="font-medium">Product Manager - Microsoft</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Analyzed on Dec 10, 2024
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      72%
                    </div>
                    <Badge variant="warning">Medium Match</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard