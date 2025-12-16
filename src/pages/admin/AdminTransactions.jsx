import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { getAllTransactions } from '../../services/adminService'

export default function AdminTransactions() {
    const [data, setData] = useState({ transactions: [], total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTransactions()
    }, [data.page])

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const result = await getAllTransactions(data.page, 10)
            setData(result)
        } catch (err) {
            console.error('Error fetching transactions:', err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'paid': return 'bg-blue-100 text-blue-700'
            case 'disputed': return 'bg-red-100 text-red-700'
            case 'refunded': return 'bg-gray-100 text-gray-700'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    if (loading && data.transactions.length === 0) {
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
                    <span className="text-primary-500">Transactions</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {data.total} total transactions
                </p>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ORDER ID</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">LISTING</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">BUYER</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SELLER</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">AMOUNT</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactions.map((tx) => (
                                <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                        {tx.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {tx.listing?.title || 'Deleted Listing'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {tx.buyer?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {tx.seller?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        ${tx.amount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {data.transactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
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
