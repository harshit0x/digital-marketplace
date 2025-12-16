import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    CheckCircle,
    List,
    CreditCard,
    Wallet,
    Users,
    ArrowLeft
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Verify', path: '/admin/verify', icon: CheckCircle },
    { name: 'Listings', path: '/admin/listings', icon: List },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
    { name: 'Withdrawals', path: '/admin/withdrawals', icon: Wallet },
]

export default function AdminSidebar() {
    const location = useLocation()

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin'
        return location.pathname.startsWith(path)
    }

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 pt-16">
            {/* User Info */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">SocialSwap</p>
                        <p className="text-xs text-gray-500">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Back to Site */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Site</span>
                </Link>
            </div>
        </aside>
    )
}
