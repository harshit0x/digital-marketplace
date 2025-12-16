import { supabase } from '../lib/supabase'

/**
 * Check if current user is admin
 */
export async function isAdmin() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (error || !data) {
        return false
    }

    return data.is_admin === true
}

/**
 * Get dashboard stats
 */
export async function getAdminStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get total listings count
    const { count: totalListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })

    // Get active listings count
    const { count: activeListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // Get total users count
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Get total revenue from completed orders
    const { data: orders } = await supabase
        .from('orders')
        .select('amount')
        .eq('status', 'completed')

    const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0) || 0

    // Get pending verifications
    const { count: pendingVerifications } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false)
        .eq('status', 'active')

    return {
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        pendingVerifications: pendingVerifications || 0,
    }
}

/**
 * Get all listings for admin
 */
export async function getAllListings(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
        .from('listings')
        .select(`
            *,
            profiles:user_id (
                id,
                full_name,
                email
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        listings: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    }
}

/**
 * Get all users for admin
 */
export async function getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        users: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    }
}

/**
 * Get all transactions/orders for admin
 */
export async function getAllTransactions(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
        .from('orders')
        .select(`
            *,
            listing:listing_id (
                id,
                title,
                platform
            ),
            buyer:buyer_id (
                id,
                full_name,
                email
            ),
            seller:seller_id (
                id,
                full_name,
                email
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error

    return {
        transactions: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
    }
}

/**
 * Verify a listing
 */
export async function verifyListing(listingId) {
    const { data, error } = await supabase
        .from('listings')
        .update({ is_verified: true })
        .eq('id', listingId)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Unverify a listing
 */
export async function unverifyListing(listingId) {
    const { data, error } = await supabase
        .from('listings')
        .update({ is_verified: false })
        .eq('id', listingId)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a listing (admin)
 */
export async function adminDeleteListing(listingId) {
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

    if (error) throw error
    return true
}

/**
 * Update listing status
 */
export async function updateListingStatus(listingId, status) {
    const { data, error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', listingId)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Get recent listings for dashboard
 */
export async function getRecentListings(limit = 5) {
    const { data, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles:user_id (
                full_name,
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data || []
}
