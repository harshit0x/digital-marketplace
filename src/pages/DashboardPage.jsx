import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Package, MessageSquare, DollarSign, TrendingUp, Loader2, Trash2, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserListings, deleteListing } from '../services/listingsService'
import { getDashboardStats } from '../services/profileService'
import DeleteModal from '../components/ui/DeleteModal'

export default function DashboardPage() {
    const { user } = useAuth()
    const [listings, setListings] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [deleteModal, setDeleteModal] = useState({ open: false, listing: null })

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [listingsData, statsData] = await Promise.all([
                getUserListings(user.id),
                getDashboardStats(),
            ])
            setListings(listingsData || [])
            setStats(statsData)
        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        } finally {
            setLoading(false)
        }
    }

    const openDeleteModal = (listing) => {
        setDeleteModal({ open: true, listing })
    }

    const closeDeleteModal = () => {
        setDeleteModal({ open: false, listing: null })
    }

    const handleDelete = async () => {
        if (!deleteModal.listing) return

        try {
            setDeletingId(deleteModal.listing.id)
            await deleteListing(deleteModal.listing.id)
            setListings(listings.filter(l => l.id !== deleteModal.listing.id))
            closeDeleteModal()
        } catch (err) {
            console.error('Error deleting listing:', err)
        } finally {
            setDeletingId(null)
        }
    }

    const formatFollowers = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
        return num?.toString() || '0'
    }

    const statCards = [
        {
            label: 'Active Listings',
            value: stats?.activeListings || 0,
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-50'
        },
        {
            label: 'Total Sales',
            value: `$${(stats?.totalSales || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-500',
            bg: 'bg-green-50'
        },
        {
            label: 'Messages',
            value: stats?.unreadMessages || 0,
            icon: MessageSquare,
            color: 'text-purple-500',
            bg: 'bg-purple-50'
        },
        {
            label: 'Purchases',
            value: stats?.totalPurchases || 0,
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-50'
        },
    ]

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                    </div>
                    <Link to="/create" className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Listing
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-neumorphic"
                        >
                            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* My Listings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-neumorphic"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">My Listings</h2>

                    {listings.length > 0 ? (
                        <div className="space-y-4">
                            {listings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <span className="text-lg font-bold text-primary-600">
                                                {listing.platform?.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{listing.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                @{listing.username} • {formatFollowers(listing.followers)} followers • ${listing.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${listing.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : listing.status === 'sold'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                                        </span>
                                        <Link
                                            to={`/listing/${listing.id}`}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(listing)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">You don't have any listings yet</p>
                            <Link to="/create" className="btn-primary inline-flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create Your First Listing
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.open}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={deletingId !== null}
                title="Delete Listing"
                message={`Are you sure you want to delete "${deleteModal.listing?.title}"? This action cannot be undone.`}
            />
        </div>
    )
}
