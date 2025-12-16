import { useState } from 'react'
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react'

const platforms = [
    { id: 'youtube', name: 'YouTube' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitch', name: 'Twitch' },
    { id: 'discord', name: 'Discord' },
]

const niches = [
    'Gaming', 'Food', 'Travel', 'Fitness', 'Fashion',
    'Tech', 'Music', 'Education', 'Business', 'Lifestyle'
]

const followerOptions = [
    { value: 'any', label: 'Any amount' },
    { value: '1000', label: '1,000+' },
    { value: '10000', label: '10,000+' },
    { value: '50000', label: '50,000+' },
    { value: '100000', label: '100,000+' },
    { value: '500000', label: '500,000+' },
    { value: '1000000', label: '1,000,000+' },
]

export default function FilterSidebar({ filters, setFilters, onClose }) {
    const [expandedSections, setExpandedSections] = useState({
        platform: true,
        price: true,
        followers: true,
        niche: true,
    })

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handlePlatformToggle = (platformId) => {
        const newPlatforms = filters.platforms.includes(platformId)
            ? filters.platforms.filter(p => p !== platformId)
            : [...filters.platforms, platformId]
        setFilters({ ...filters, platforms: newPlatforms })
    }

    const handleNicheToggle = (niche) => {
        const newNiches = filters.niches?.includes(niche)
            ? filters.niches.filter(n => n !== niche)
            : [...(filters.niches || []), niche]
        setFilters({ ...filters, niches: newNiches })
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">Filters</span>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by username, platform, niche..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="input-field text-sm"
                />
            </div>

            {/* Platform Section */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('platform')}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-medium text-gray-900">Platform</span>
                    {expandedSections.platform ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {expandedSections.platform && (
                    <div className="space-y-2">
                        {platforms.map((platform) => (
                            <label key={platform.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.platforms.includes(platform.id)}
                                    onChange={() => handlePlatformToggle(platform.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-600">{platform.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range Section */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-medium text-gray-900">Price Range</span>
                    {expandedSections.price ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {expandedSections.price && (
                    <div className="space-y-3">
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={filters.maxPrice || 100000}
                            onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                            className="w-full accent-primary-500"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>$0</span>
                            <span>${(filters.maxPrice || 100000).toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Minimum Followers Section */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection('followers')}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-medium text-gray-900">Minimum Followers</span>
                    {expandedSections.followers ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {expandedSections.followers && (
                    <select
                        value={filters.minFollowers || 'any'}
                        onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
                        className="input-field text-sm"
                    >
                        {followerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Niche Section */}
            <div>
                <button
                    onClick={() => toggleSection('niche')}
                    className="flex items-center justify-between w-full mb-3"
                >
                    <span className="font-medium text-gray-900">Niche</span>
                    {expandedSections.niche ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </button>
                {expandedSections.niche && (
                    <div className="flex flex-wrap gap-2">
                        {niches.map((niche) => (
                            <button
                                key={niche}
                                onClick={() => handleNicheToggle(niche)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${filters.niches?.includes(niche)
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {niche}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
