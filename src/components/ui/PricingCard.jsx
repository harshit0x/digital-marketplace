import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

export default function PricingCard({ plan, featured = false, index = 0 }) {
    const {
        name,
        price,
        period,
        description,
        features,
        buttonText,
        buttonAction,
    } = plan

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative rounded-2xl p-6 transition-all duration-300 ${featured
                    ? 'bg-white shadow-neumorphic-lg hover:shadow-neumorphic-hover'
                    : 'bg-white shadow-neumorphic hover:shadow-neumorphic-hover'
                }`}
        >
            {/* Featured Badge */}
            {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Popular
                    </span>
                </div>
            )}

            {/* Plan Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">${price}</span>
                {period && (
                    <span className="text-gray-500">/{period}</span>
                )}
            </div>

            {description && (
                <p className="text-sm text-gray-500 mb-6">{description}</p>
            )}

            {/* Features */}
            <ul className="space-y-3 mb-6">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary-600" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={buttonAction}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${featured
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:scale-[0.98]'
                    }`}
            >
                {buttonText}
            </button>
        </motion.div>
    )
}
