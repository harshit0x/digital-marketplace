import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Filter, X, Loader2 } from 'lucide-react'
import FilterSidebar from '../components/marketplace/FilterSidebar'
import ListingCard from '../components/listings/ListingCard'
import { getListings } from '../services/listingsService'

export default function BrowseListingsPage() {
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        search: '',
        platforms: [],
        maxPrice: 100000,
        minFollowers: 'any',
        niches: [],
    })

    useEffect(() => {
        fetchListings()
    }, [filters])

    const fetchListings = async () => {
        try {
            setLoading(true)
            setError(null)

            // Build filter object for the service
            const filterParams = {}

            if (filters.search) {
                filterParams.search = filters.search
            }
            if (filters.platforms.length === 1) {
                filterParams.platform = filters.platforms[0]
            }
            if (filters.maxPrice < 100000) {
                filterParams.maxPrice = filters.maxPrice
            }
            if (filters.minFollowers !== 'any') {
                filterParams.minFollowers = filters.minFollowers
            }
            if (filters.niches.length === 1) {
                filterParams.niche = filters.niches[0]
            }

            const data = await getListings(filterParams)

            // Client-side filtering for multiple platforms/niches
            let filteredData = data

            if (filters.platforms.length > 1) {
                filteredData = filteredData.filter(l =>
                    filters.platforms.includes(l.platform.toLowerCase())
                )
            }

            if (filters.niches.length > 1) {
                filteredData = filteredData.filter(l =>
                    filters.niches.includes(l.niche)
                )
            }

            setListings(filteredData)
        } catch (err) {
            console.error('Error fetching listings:', err)
            setError('Failed to load listings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                onClose={() => { }}
                            />
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-16">
                                <p className="text-red-500">{error}</p>
                                <button
                                    onClick={fetchListings}
                                    className="mt-4 btn-primary"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : listings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {listings.map((listing, index) => (
                                    <ListingCard key={listing.id} listing={listing} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-500">No listings found matching your filters.</p>
                                <button
                                    onClick={() => setFilters({
                                        search: '',
                                        platforms: [],
                                        maxPrice: 100000,
                                        minFollowers: 'any',
                                        niches: [],
                                    })}
                                    className="mt-4 text-primary-500 hover:text-primary-600"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
                        >
                            <div className="p-4">
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    onClose={() => setShowMobileFilters(false)}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
