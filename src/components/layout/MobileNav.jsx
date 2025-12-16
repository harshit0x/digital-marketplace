import { Link, useLocation } from 'react-router-dom'
import { Home, Search, MessageSquare, User } from 'lucide-react'

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/dashboard', icon: User, label: 'Profile' },
]

export default function MobileNav() {
    const location = useLocation()

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
            <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${isActive(item.path)
                                ? 'text-primary-500'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs mt-1 font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}
