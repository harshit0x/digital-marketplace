import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ className = '' }) {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/browse?search=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Instagram account"
                    className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                >
                    Search
                </button>
            </div>
        </form>
    )
}
