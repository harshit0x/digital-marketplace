import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Users,
    TrendingUp,
    MapPin,
    CheckCircle,
    Instagram,
    Youtube,
    Twitter,
    Twitch,
    ArrowRight
} from 'lucide-react'

const platformIcons = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    twitch: Twitch,
    tiktok: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    ),
}

const platformColors = {
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    youtube: 'bg-red-500',
    twitter: 'bg-sky-500',
    tiktok: 'bg-black',
    twitch: 'bg-purple-600',
    discord: 'bg-indigo-500',
}

export default function ListingCard({ listing, index = 0 }) {
    const {
        id,
        title,
        username,
        platform = 'instagram',
        followers,
        engagement,
        niche,
        location,
        description,
        price,
        verified = false,
    } = listing

    const PlatformIcon = platformIcons[platform.toLowerCase()] || Instagram
    const platformColor = platformColors[platform.toLowerCase()] || 'bg-gray-500'

    const formatFollowers = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
        return num.toString()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group bg-white rounded-2xl p-5 shadow-neumorphic hover:shadow-neumorphic-hover transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${platformColor} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <PlatformIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{title}</h3>
                        <p className="text-sm text-gray-500">@{username} • {platform}</p>
                    </div>
                </div>
                {verified && (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900">{formatFollowers(followers)}</span>
                        <span className="text-xs text-gray-500 ml-1">followers</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900">{engagement}%</span>
                        <span className="text-xs text-gray-500 ml-1">engagement</span>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 mb-3">
                {niche && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">{niche}</span>
                )}
                {location && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {location}
                    </span>
                )}
            </div>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                    <span className="text-2xl font-bold text-gray-900">${price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">USD</span>
                </div>
                <Link
                    to={`/listing/${id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    More Details
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    )
}
