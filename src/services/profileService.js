import { supabase } from '../lib/supabase'

/**
 * Get user profile by ID
 */
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        throw error
    }

    return data
}

/**
 * Get current user's profile
 */
export async function getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not logged in')
    }

    return getProfile(user.id)
}

/**
 * Update user profile
 */
export async function updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not logged in')
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) {
        console.error('Error updating profile:', error)
        throw error
    }

    return data
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(file) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not logged in')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl })

    return publicUrl
}

/**
 * Get user dashboard stats
 */
export async function getDashboardStats() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not logged in')
    }

    // Get listings stats
    const { data: listings } = await supabase
        .from('listings')
        .select('id, status, price')
        .eq('user_id', user.id)

    // Get sales (orders where user is seller)
    const { data: sales } = await supabase
        .from('orders')
        .select('id, amount, status')
        .eq('seller_id', user.id)
        .eq('status', 'completed')

    // Get purchases (orders where user is buyer)
    const { data: purchases } = await supabase
        .from('orders')
        .select('id, amount, status')
        .eq('buyer_id', user.id)
        .eq('status', 'completed')

    // Get unread messages
    const { count: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id)

    return {
        activeListings: listings?.filter(l => l.status === 'active').length || 0,
        totalSales: sales?.reduce((sum, o) => sum + parseFloat(o.amount), 0) || 0,
        totalPurchases: purchases?.length || 0,
        unreadMessages: unreadMessages || 0,
    }
}
