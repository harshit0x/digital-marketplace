import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadMultipleImages } from '../../services/uploadService'

export default function ImageUploader({
    images = [],
    onChange,
    maxImages = 5
}) {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState(null)
    const inputRef = useRef(null)

    const handleFiles = async (files) => {
        if (!files || files.length === 0) return

        // Check max limit
        const remainingSlots = maxImages - images.length
        if (remainingSlots <= 0) {
            setError(`Maximum ${maxImages} images allowed`)
            return
        }

        // Filter to only images and limit count
        const validFiles = Array.from(files)
            .filter(file => file.type.startsWith('image/'))
            .slice(0, remainingSlots)

        if (validFiles.length === 0) {
            setError('Please select valid image files')
            return
        }

        setError(null)
        setUploading(true)

        try {
            const urls = await uploadMultipleImages(validFiles)
            onChange([...images, ...urls])
        } catch (err) {
            console.error('Upload failed:', err)
            setError('Failed to upload images. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleChange = (e) => {
        handleFiles(e.target.files)
    }

    const removeImage = (index) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${uploading ? 'pointer-events-none opacity-70' : ''}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        <p className="text-gray-600">Uploading to Cloudinary...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-600">
                            <span className="text-primary-500 font-medium">Click to upload</span>
                            {' '}or drag and drop
                        </p>
                        <p className="text-sm text-gray-400">
                            PNG, JPG up to 10MB ({images.length}/{maxImages})
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Image Preview Grid */}
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {images.map((url, index) => (
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeImage(index)
                                    }}
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                                        Cover
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
