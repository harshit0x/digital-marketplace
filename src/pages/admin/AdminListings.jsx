import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllListings, adminDeleteListing, updateListingStatus } from '../../services/adminService'

export default function AdminListings() {
    const [data, setData] = useState({ listings: [], total: 0, page: 1, totalPages: 1 })
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        fetchListings()
    }, [data.page])

    const fetchListings = async () => {
        try {
            setLoading(true)
            const result = await getAllListings(data.page, 10)
            setData(result)
        } catch (err) {
            console.error('Error fetching listings:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return

        try {
            setDeleting(id)
            await adminDeleteListing(id)
            setData({
                ...data,
                listings: data.listings.filter(l => l.id !== id),
                total: data.total - 1,
            })
        } catch (err) {
            console.error('Error deleting listing:', err)
            alert('Failed to delete listing')
        } finally {
            setDeleting(null)
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateListingStatus(id, newStatus)
            setData({
                ...data,
                listings: data.listings.map(l =>
                    l.id === id ? { ...l, status: newStatus } : l
                ),
            })
        } catch (err) {
            console.error('Error updating status:', err)
        }
    }

    if (loading && data.listings.length === 0) {
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
                    All <span className="text-primary-500">Listings</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {data.total} total listings
                </p>
            </div>

            {/* Listings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">LISTING</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">PLATFORM</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">PRICE</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SELLER</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">VERIFIED</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.listings.map((listing) => (
                                <tr key={listing.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{listing.title}</div>
                                            <div className="text-sm text-gray-500">@{listing.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{listing.platform}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        ${listing.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {listing.profiles?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={listing.status}
                                            onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                                            className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="sold">Sold</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        {listing.is_verified ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-300" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/listing/${listing.id}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                disabled={deleting === listing.id}
                                                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                {deleting === listing.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
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
