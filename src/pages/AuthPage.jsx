import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [message, setMessage] = useState({ type: '', text: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { signIn, signUp, error } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })
        setIsSubmitting(true)

        try {
            if (isLogin) {
                // Sign In
                const { data, error } = await signIn(formData.email, formData.password)

                if (error) {
                    setMessage({ type: 'error', text: error.message })
                } else {
                    setMessage({ type: 'success', text: 'Signed in successfully!' })
                    setTimeout(() => navigate('/dashboard'), 1000)
                }
            } else {
                // Sign Up
                const { data, error } = await signUp(formData.email, formData.password, formData.name)

                if (error) {
                    setMessage({ type: 'error', text: error.message })
                } else {
                    setMessage({
                        type: 'success',
                        text: 'Account created! Please check your email to verify your account.'
                    })
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl p-8 shadow-neumorphic">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-gray-500">
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Start buying and selling social accounts'
                            }
                        </p>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                        >
                            {message.type === 'success'
                                ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            }
                            <span className="text-sm">{message.text}</span>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="input-field pl-10"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="input-field pl-10"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {!isLogin && (
                                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setMessage({ type: '', text: '' })
                                }}
                                className="ml-1 text-primary-500 font-medium hover:text-primary-600"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
