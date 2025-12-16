import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const NotificationContext = createContext(null)

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
}

const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-primary-500 to-primary-600',
    warning: 'from-yellow-500 to-orange-500',
}

function Toast({ notification, onDismiss }) {
    const Icon = icons[notification.type] || Info

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="flex items-center gap-3 p-4 glass-card border-dark-600 shadow-card min-w-[300px] max-w-md"
        >
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[notification.type]}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
                {notification.title && (
                    <p className="font-semibold text-white">{notification.title}</p>
                )}
                <p className="text-sm text-dark-300">{notification.message}</p>
            </div>
            <button
                onClick={() => onDismiss(notification.id)}
                className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = Date.now()
        setNotifications((prev) => [...prev, { id, type, title, message }])

        if (duration > 0) {
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id))
            }, duration)
        }

        return id
    }, [])

    const dismissNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const success = useCallback(
        (message, title) => addNotification({ type: 'success', message, title }),
        [addNotification]
    )

    const error = useCallback(
        (message, title) => addNotification({ type: 'error', message, title }),
        [addNotification]
    )

    const info = useCallback(
        (message, title) => addNotification({ type: 'info', message, title }),
        [addNotification]
    )

    const warning = useCallback(
        (message, title) => addNotification({ type: 'warning', message, title }),
        [addNotification]
    )

    return (
        <NotificationContext.Provider value={{ success, error, info, warning }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <Toast
                            key={notification.id}
                            notification={notification}
                            onDismiss={dismissNotification}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}
