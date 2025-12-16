const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload an image to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', 'listings')

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.secure_url
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} - Array of public URLs
 */
export async function uploadMultipleImages(files) {
    const uploadPromises = Array.from(files).map(file => uploadImage(file))
    return Promise.all(uploadPromises)
}

/**
 * Delete an image from Cloudinary (requires backend for signed requests)
 * Note: For frontend-only apps, images can't be deleted directly
 * You would need a backend endpoint for this
 */
export async function deleteImage(publicId) {
    console.warn('Image deletion requires backend implementation')
    return true
}

/**
 * Get optimized image URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 */
export function getOptimizedUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) return url

    const { width = 800, quality = 'auto', format = 'auto' } = options

    // Insert transformations into the URL
    const parts = url.split('/upload/')
    if (parts.length === 2) {
        return `${parts[0]}/upload/w_${width},q_${quality},f_${format}/${parts[1]}`
    }

    return url
}
