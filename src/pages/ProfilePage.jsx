import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

export default function ProfilePage() {
    const { id } = useParams()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen pt-24 px-4 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-400">U</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">User Profile</h1>
                    <p className="text-gray-500">Profile ID: {id}</p>
                </div>
            </div>
        </motion.div>
    )
}
