import React, { useActionState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      
      try {
        await login({ email, password })
        return { success: true, error: null }
      } catch (err) {
        return { 
          success: false, 
          error: err instanceof Error ? err.message : 'Login failed. Please try again.' 
        }
      }
    },
    { success: false, error: null }
  )
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Navigate on successful login
  React.useEffect(() => {
    if (state.success) {
      navigate('/dashboard')
    }
  }, [state.success, navigate])

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Sign In to JobRizz
      </h2>
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
          {state.error}
        </div>
      )}
      
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
      

    </div>
  )
}

export default Login