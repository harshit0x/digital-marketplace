import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ExternalLink,
    CheckCircle,
    DollarSign,
    MessageSquare,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    Users,
    TrendingUp,
    Calendar,
    MapPin,
    Loader2,
    Instagram,
    Youtube,
    Twitter,
    Twitch
} from 'lucide-react'
import { getListingById } from '../services/listingsService'
import { startConversation } from '../services/messagesService'
import { createCheckoutSession } from '../services/paymentsService'
import { useAuth } from '../context/AuthContext'

const platformIcons = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    twitch: Twitch,
}

const platformColors = {
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    youtube: 'bg-red-500',
    twitter: 'bg-sky-500',
    tiktok: 'bg-black',
    twitch: 'bg-purple-600',
}

export default function ListingDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [startingChat, setStartingChat] = useState(false)
    const [purchasing, setPurchasing] = useState(false)

    useEffect(() => {
        fetchListing()
    }, [id])

    const fetchListing = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getListingById(id)
            setListing(data)
        } catch (err) {
            console.error('Error fetching listing:', err)
            setError('Failed to load listing')
        } finally {
            setLoading(false)
        }
    }

    const handleStartChat = async () => {
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: `/listing/${id}` } })
            return
        }

        try {
            setStartingChat(true)
            const conversation = await startConversation(
                listing.profiles.id,
                listing.id,
                `Hi, I'm interested in your ${listing.platform} account "${listing.title}"`
            )
            navigate('/messages', { state: { conversationId: conversation.id } })
        } catch (err) {
            console.error('Error starting chat:', err)
            alert('Failed to start conversation')
        } finally {
            setStartingChat(false)
        }
    }

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: `/listing/${id}` } })
            return
        }

        try {
            setPurchasing(true)
            const { orderId } = await createCheckoutSession(listing.id)
            navigate(`/checkout/${orderId}`)
        } catch (err) {
            console.error('Error creating checkout:', err)
            alert(err.message || 'Failed to start checkout')
        } finally {
            setPurchasing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{error || 'Listing not found'}</p>
                    <Link to="/browse" className="btn-primary">
                        Browse Listings
                    </Link>
                </div>
            </div>
        )
    }

    const PlatformIcon = platformIcons[listing.platform?.toLowerCase()] || Instagram
    const platformColor = platformColors[listing.platform?.toLowerCase()] || 'bg-gray-500'
    const screenshots = listing.screenshots?.length > 0 ? listing.screenshots : ['/placeholder.jpg']

    const formatFollowers = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${Math.floor(num / 1000)},${String(num % 1000).padStart(3, '0')}`
        return num?.toString() || '0'
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % screenshots.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
    }

    const isOwnListing = user?.id === listing.user_id

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Back Link */}
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Marketplace</span>
                </Link>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 mb-6 shadow-neumorphic"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg ${platformColor} flex items-center justify-center text-white`}>
                                        <PlatformIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
                                            <ExternalLink className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500">@{listing.username} • {listing.platform}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            {listing.is_verified && (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Verified
                                                </span>
                                            )}
                                            {listing.is_monetized && (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    Monetized
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-gray-900">${listing.price?.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">USD</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Screenshots */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-6 mb-6 shadow-neumorphic"
                        >
                            <h2 className="font-semibold text-gray-900 mb-4">Screenshots & Proof</h2>

                            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                {screenshots[0] !== '/placeholder.jpg' ? (
                                    <img
                                        src={screenshots[currentSlide]}
                                        alt={`Screenshot ${currentSlide + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                        <span className="text-gray-500">No screenshots available</span>
                                    </div>
                                )}

                                {screenshots.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </>
                                )}

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {screenshots.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSlide(i)}
                                            className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 mb-6 shadow-neumorphic"
                        >
                            <h2 className="font-semibold text-gray-900 mb-4">Account Statistics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Users className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{formatFollowers(listing.followers)}</div>
                                    <div className="text-sm text-gray-500">Followers</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{listing.engagement || 0}%</div>
                                    <div className="text-sm text-gray-500">Engagement</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">
                                        {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-sm text-gray-500">Listed</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                                    <div className="font-bold text-gray-900">{listing.location || 'N/A'}</div>
                                    <div className="text-sm text-gray-500">Location</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-6 shadow-neumorphic"
                        >
                            <h2 className="font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {listing.description || 'No description provided.'}
                            </p>
                            {listing.niche && (
                                <div className="mt-4">
                                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-700">
                                        {listing.niche}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-6 sticky top-24 shadow-neumorphic"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>

                            {/* Seller Info */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                    {listing.profiles?.full_name?.charAt(0) || listing.profiles?.email?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {listing.profiles?.full_name || 'Seller'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {listing.profiles?.email}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-6">
                                Member since {new Date(listing.profiles?.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>

                            {/* Action Buttons */}
                            {!isOwnListing && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleStartChat}
                                        disabled={startingChat}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-70"
                                    >
                                        {startingChat ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <MessageSquare className="w-5 h-5" />
                                        )}
                                        Chat with Seller
                                    </button>
                                    <button
                                        onClick={handlePurchase}
                                        disabled={purchasing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-colors shadow-lg disabled:opacity-70"
                                    >
                                        {purchasing ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <ShoppingCart className="w-5 h-5" />
                                        )}
                                        Purchase - ${listing.price?.toLocaleString()}
                                    </button>
                                </div>
                            )}

                            {isOwnListing && (
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">This is your listing</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
