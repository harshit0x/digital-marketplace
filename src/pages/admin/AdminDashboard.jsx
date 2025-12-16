import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    DollarSign,
    List,
    Users,
    TrendingUp,
    Loader2
} from 'lucide-react'
import { getAdminStats, getRecentListings } from '../../services/adminService'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [recentListings, setRecentListings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [statsData, listingsData] = await Promise.all([
                getAdminStats(),
                getRecentListings(5),
            ])
            setStats(statsData)
            setRecentListings(listingsData)
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            label: 'Total Listings',
            value: stats?.totalListings || 0,
            icon: List,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Total Revenue',
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Active Listings',
            value: stats?.activeListings || 0,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Admin <span className="text-primary-500">Dashboard</span>
                </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Listings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Listings</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">#</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">TITLE</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">NICHE</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">PLATFORM</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">USERNAME</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentListings.map((listing, index) => (
                                <tr key={listing.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}.</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{listing.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{listing.niche || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 lowercase">{listing.platform}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">@{listing.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${listing.is_verified
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {listing.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentListings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No listings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
