import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Shield, ShieldOff, Mail } from 'lucide-react'
import { getAllUsers } from '../../services/adminService'
import { supabase } from '../../lib/supabase'

export default function AdminUsers() {
    const [data, setData] = useState({ users: [], total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [data.page])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const result = await getAllUsers(data.page, 10)
            setData(result)
        } catch (err) {
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleAdmin = async (userId, currentStatus) => {
        try {
            setUpdating(userId)
            const { error } = await supabase
                .from('profiles')
                .update({ is_admin: !currentStatus })
                .eq('id', userId)

            if (error) throw error

            setData({
                ...data,
                users: data.users.map(u =>
                    u.id === userId ? { ...u, is_admin: !currentStatus } : u
                ),
            })
        } catch (err) {
            console.error('Error updating admin status:', err)
            alert('Failed to update admin status')
        } finally {
            setUpdating(null)
        }
    }

    if (loading && data.users.length === 0) {
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
                    All <span className="text-primary-500">Users</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {data.total} registered users
                </p>
            </div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">USER</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">EMAIL</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">JOINED</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SALES</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ROLE</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map((user) => (
                                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {user.full_name || 'No Name'}
                                                </div>
                                                {user.is_verified && (
                                                    <span className="text-xs text-green-500">Verified</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.total_sales || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_admin
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`mailto:${user.email}`}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="Send Email"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => toggleAdmin(user.id, user.is_admin)}
                                                disabled={updating === user.id}
                                                className={`p-2 transition-colors ${user.is_admin
                                                        ? 'text-red-400 hover:text-red-600'
                                                        : 'text-green-400 hover:text-green-600'
                                                    }`}
                                                title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                            >
                                                {updating === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : user.is_admin ? (
                                                    <ShieldOff className="w-4 h-4" />
                                                ) : (
                                                    <Shield className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Page {data.page} of {data.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setData({ ...data, page: data.page - 1 })}
                                disabled={data.page === 1}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setData({ ...data, page: data.page + 1 })}
                                disabled={data.page === data.totalPages}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
