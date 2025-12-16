import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Upload,
    Loader2,
    Instagram,
    Youtube,
    Twitter
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createListing } from '../services/listingsService'
import { uploadImage } from '../services/uploadService'
import ImageUploader from '../components/ui/ImageUploader'

const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'tiktok', name: 'TikTok', icon: null },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'twitch', name: 'Twitch', icon: null },
]

const niches = [
    'Fashion', 'Travel', 'Food', 'Fitness', 'Gaming',
    'Technology', 'Beauty', 'Music', 'Education', 'Business'
]

export default function CreateListingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [screenshots, setScreenshots] = useState([])

    const [formData, setFormData] = useState({
        title: '',
        username: '',
        platform: '',
        followers: '',
        engagement: '',
        niche: '',
        location: '',
        description: '',
        price: '',
        isMonetized: false,
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!formData.title || !formData.platform || !formData.price) {
            setError('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)

            const listingData = {
                title: formData.title,
                username: formData.username,
                platform: formData.platform,
                followers: parseInt(formData.followers) || 0,
                engagement: parseFloat(formData.engagement) || 0,
                niche: formData.niche,
                location: formData.location,
                description: formData.description,
                price: parseFloat(formData.price),
                is_monetized: formData.isMonetized,
                screenshots: screenshots,
            }

            await createListing(listingData)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Failed to create listing')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-neumorphic"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Listing</h1>
                    <p className="text-gray-500 mb-8">Fill in the details about your social media account</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Listing Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Travel Instagram with 50K Followers"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Platform */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform *
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {platforms.map((platform) => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, platform: platform.id }))}
                                        className={`p-3 rounded-xl border-2 transition-all ${formData.platform === platform.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{platform.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Username and Followers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Handle
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="username"
                                        className="input-field pl-8"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">The account being sold</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Followers
                                </label>
                                <input
                                    type="number"
                                    name="followers"
                                    value={formData.followers}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Engagement and Niche */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Engagement Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="engagement"
                                    value={formData.engagement}
                                    onChange={handleChange}
                                    placeholder="3.5"
                                    step="0.1"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niche
                                </label>
                                <select
                                    name="niche"
                                    value={formData.niche}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Select niche</option>
                                    {niches.map((niche) => (
                                        <option key={niche} value={niche.toLowerCase()}>
                                            {niche}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., United States"
                                className="input-field"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your account, its history, and what makes it valuable..."
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>

                        {/* Screenshots */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Screenshots
                            </label>
                            <ImageUploader
                                images={screenshots}
                                onImagesChange={setScreenshots}
                                maxImages={5}
                            />
                        </div>

                        {/* Price and Monetized */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (USD) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="500"
                                        className="input-field pl-8"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isMonetized"
                                        checked={formData.isMonetized}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">Account is monetized</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn-primary flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Create Listing
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
