import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    CreditCard,
    Shield,
    CheckCircle,
    Loader2,
    ArrowLeft,
    Lock
} from 'lucide-react'
import { getOrder, updateOrderStatus } from '../services/paymentsService'

export default function CheckoutPage() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (orderId) {
            fetchOrder()
        }
    }, [orderId])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const data = await getOrder(orderId)

            if (data.status !== 'pending') {
                setError('This order has already been processed')
                return
            }

            setOrder(data)
        } catch (err) {
            console.error('Error fetching order:', err)
            setError('Order not found')
        } finally {
            setLoading(false)
        }
    }

    const handlePayment = async () => {
        try {
            setProcessing(true)
            setError(null)

            // Simulate payment processing
            // In production, this would integrate with Stripe Checkout
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Update order status
            await updateOrderStatus(orderId, 'paid')

            setSuccess(true)

            // Redirect to success after delay
            setTimeout(() => {
                navigate('/dashboard', {
                    state: { message: 'Payment successful! The seller will be notified.' }
                })
            }, 3000)
        } catch (err) {
            console.error('Payment error:', err)
            setError('Payment failed. Please try again.')
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    if (error && !order) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Link to="/browse" className="btn-primary">
                        Browse Listings
                    </Link>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-6">
                        The seller has been notified and will transfer the account to you.
                    </p>
                    <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-lg mx-auto px-4 py-8">
                {/* Back Link */}
                <Link
                    to={`/listing/${order.listing_id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Listing</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-neumorphic"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{order.listing?.title}</p>
                                <p className="text-sm text-gray-500">
                                    @{order.listing?.username} • {order.listing?.platform}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900">${order.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Platform Fee (5%)</span>
                                <span className="text-gray-900">${order.platform_fee?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-primary-600">
                                    ${(order.amount + order.platform_fee)?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Seller</h3>
                        <p className="text-gray-600">{order.seller?.full_name || order.seller?.email}</p>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl mb-6">
                        <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-green-800 font-medium">Buyer Protection</p>
                            <p className="text-sm text-green-600">
                                Your payment is held securely until the account transfer is verified.
                            </p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Pay ${(order.amount + order.platform_fee)?.toLocaleString()}
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        By completing this purchase, you agree to our Terms of Service
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
