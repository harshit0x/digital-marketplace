import { motion } from 'framer-motion'
import { Wallet, AlertCircle } from 'lucide-react'

export default function AdminWithdrawals() {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    <span className="text-primary-500">Withdrawals</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage payout requests
                </p>
            </div>

            {/* Coming Soon */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
            >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Withdrawals Coming Soon
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    This feature will allow sellers to request payouts from their earnings.
                    Stripe Connect integration required.
                </p>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg inline-flex items-center gap-2 text-yellow-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Requires Stripe Connect setup</span>
                </div>
            </motion.div>
        </div>
    )
}
