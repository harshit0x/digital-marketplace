import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllListings, verifyListing, unverifyListing } from '../../services/adminService'

export default function AdminVerify() {
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [verifying, setVerifying] = useState(null)

    useEffect(() => {
        fetchListings()
    }, [])

    const fetchListings = async () => {
        try {
            setLoading(true)
            const data = await getAllListings(1, 50)
            // Show unverified first
            const sorted = data.listings.sort((a, b) => {
                if (a.is_verified === b.is_verified) return 0
                return a.is_verified ? 1 : -1
            })
            setListings(sorted)
        } catch (err) {
            console.error('Error fetching listings:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (id, currentStatus) => {
        try {
            setVerifying(id)
            if (currentStatus) {
                await unverifyListing(id)
            } else {
                await verifyListing(id)
            }
            setListings(listings.map(l =>
                l.id === id ? { ...l, is_verified: !currentStatus } : l
            ))
        } catch (err) {
            console.error('Error updating verification:', err)
        } finally {
            setVerifying(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    const pendingCount = listings.filter(l => !l.is_verified).length

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Verify <span className="text-primary-500">Listings</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {pendingCount} listings pending verification
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
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">FOLLOWERS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">PRICE</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SELLER</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.map((listing) => (
                                <tr key={listing.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{listing.title}</div>
                                            <div className="text-sm text-gray-500">@{listing.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{listing.platform}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {listing.followers?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        ${listing.price?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {listing.profiles?.full_name || listing.profiles?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${listing.is_verified
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {listing.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/listing/${listing.id}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="View Listing"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleVerify(listing.id, listing.is_verified)}
                                                disabled={verifying === listing.id}
                                                className={`p-2 rounded-lg transition-colors ${listing.is_verified
                                                        ? 'text-red-500 hover:bg-red-50'
                                                        : 'text-green-500 hover:bg-green-50'
                                                    }`}
                                                title={listing.is_verified ? 'Remove Verification' : 'Verify'}
                                            >
                                                {verifying === listing.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : listing.is_verified ? (
                                                    <XCircle className="w-4 h-4" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {listings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
