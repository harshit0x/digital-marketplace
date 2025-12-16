import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, ArrowRight, Shield, Zap, Users, Instagram, Youtube, Twitter, Loader2 } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import ListingCard from '../components/listings/ListingCard'
import PricingCard from '../components/ui/PricingCard'
import { getListings } from '../services/listingsService'


// Pricing plans
const pricingPlans = [
    {
        name: 'Free',
        price: 0,
        period: null,
        description: 'Always free',
        features: [
            '5 Free Listings',
            'Standard Listings',
            'Basic Tools',
            'Email Support',
            'No Branding',
            '10% Transaction fee',
        ],
        buttonText: 'Subscribe',
        buttonAction: () => { },
    },
    {
        name: 'Premium',
        price: 8,
        period: 'month',
        description: 'Billed annually',
        features: [
            'Unlimited Listings',
            'Featured Listings',
            'Ad & Promotion Tools',
            '1 - 1 Support',
            'Custom Branding',
            '7% transaction fee',
        ],
        buttonText: 'Start 7-day free trial',
        buttonAction: () => { },
    },
]

// Features for CTA section
const features = [
    {
        icon: Shield,
        title: 'Secure Transactions',
        description: 'All payments are protected with escrow until transfer is complete.'
    },
    {
        icon: Zap,
        title: 'Fast Transfers',
        description: 'Complete account transfers within 24-48 hours on average.'
    },
    {
        icon: Users,
        title: 'Verified Sellers',
        description: 'All sellers go through a verification process for your safety.'
    },
]

export default function HomePage() {
    const [listings, setListings] = useState([])
    const [loadingListings, setLoadingListings] = useState(true)

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const data = await getListings({ limit: 4 })
                setListings(data)
            } catch (err) {
                console.error('Error fetching listings:', err)
            } finally {
                setLoadingListings(false)
            }
        }
        fetchListings()
    }, [])

    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">Used by 10,000+ users</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                    >
                        Buy & Sell your{' '}
                        <span className="relative">
                            <span className="text-primary-500">Social</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-pink-400 rounded-full" />
                        </span>
                        <br />
                        <span className="text-primary-500">Profiles</span> online.
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                    >
                        A secure marketplace to buy and sell Instagram, YouTube, Twitter, Telegram
                        and more - fast, safe and hassle-free.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-md mx-auto"
                    >
                        <SearchBar />
                    </motion.div>
                </div>
            </section>

            {/* Latest Listings Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="section-title">Latest Listings</h2>
                        <p className="section-subtitle">Discover the hottest social profiles available right now.</p>
                    </motion.div>

                    {loadingListings ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {listings.map((listing, index) => (
                                <ListingCard key={listing.id} listing={listing} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 mb-4">No listings available yet</p>
                            <Link to="/create" className="btn-primary">
                                Create the first listing
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="section-title">Choose Your Plan</h2>
                        <p className="section-subtitle">
                            Start for free and scale up as you grow. Find the perfect plan for your
                            content creation needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pricingPlans.map((plan, index) => (
                            <PricingCard
                                key={plan.name}
                                plan={plan}
                                featured={index === 1}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="section-title">Why Choose SocialSwap?</h2>
                        <p className="section-subtitle">The most trusted platform for social media account trading.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-7 h-7 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 md:p-12 text-center text-white"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to start trading?
                        </h2>
                        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of creators and businesses who trust SocialSwap for their social media account needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/browse"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Browse Listings
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary-400 text-white font-semibold rounded-lg hover:bg-primary-300 transition-colors"
                            >
                                Sell Your Account
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="text-xl font-bold mb-4">
                                <span className="text-primary-400">Social</span>Swap
                                <span className="text-primary-400">.</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                The most trusted marketplace for buying and selling social media accounts.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/browse" className="hover:text-white transition-colors">Marketplace</Link></li>
                                <li><Link to="/create" className="hover:text-white transition-colors">Sell Account</Link></li>
                                <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
                            </ul>
                        </div>

                        {/* Platforms */}
                        <div>
                            <h4 className="font-semibold mb-4">Platforms</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/browse?platform=instagram" className="hover:text-white transition-colors">Instagram</Link></li>
                                <li><Link to="/browse?platform=youtube" className="hover:text-white transition-colors">YouTube</Link></li>
                                <li><Link to="/browse?platform=tiktok" className="hover:text-white transition-colors">TikTok</Link></li>
                                <li><Link to="/browse?platform=twitter" className="hover:text-white transition-colors">Twitter</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2025 SocialSwap. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

