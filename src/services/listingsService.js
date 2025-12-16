import { supabase } from '../lib/supabase'

/**
 * Get all listings with optional filters
 */
export async function getListings(filters = {}) {
    let query = supabase
        .from('listings')
        .select(`
            *,
            profiles:user_id (
                id,
                full_name,
                avatar_url,
                reputation,
                is_verified
            )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // Apply filters
    if (filters.platform) {
        query = query.ilike('platform', filters.platform)
    }

    if (filters.niche) {
        query = query.ilike('niche', filters.niche)
    }

    if (filters.minFollowers) {
        query = query.gte('followers', parseInt(filters.minFollowers))
    }

    if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice))
    }

    if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,username.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.limit) {
        query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching listings:', error)
        throw error
    }

    return data
}

/**
 * Get a single listing by ID
 */
export async function getListingById(id) {
    const { data, error } = await supabase
        .from('listings')
        .select(`
            *,
            profiles:user_id (
                id,
                full_name,
                email,
                avatar_url,
                reputation,
                is_verified,
                created_at
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching listing:', error)
        throw error
    }

    return data
}

/**
 * Get listings by user ID
 */
export async function getUserListings(userId) {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user listings:', error)
        throw error
    }

    return data
}

/**
 * Create a new listing
 */
export async function createListing(listingData) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to create a listing')
    }

    const { data, error } = await supabase
        .from('listings')
        .insert({
            ...listingData,
            user_id: user.id,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating listing:', error)
        throw error
    }

    return data
}

/**
 * Update a listing
 */
export async function updateListing(id, updates) {
    const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating listing:', error)
        throw error
    }

    return data
}

/**
 * Delete a listing
 */
export async function deleteListing(id) {
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting listing:', error)
        throw error
    }

    return true
}

/**
 * Get listing stats for a user
 */
export async function getUserListingStats(userId) {
    const { data, error } = await supabase
        .from('listings')
        .select('id, status, price')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching listing stats:', error)
        throw error
    }

    const stats = {
        total: data.length,
        active: data.filter(l => l.status === 'active').length,
        sold: data.filter(l => l.status === 'sold').length,
        totalValue: data.reduce((sum, l) => sum + parseFloat(l.price), 0),
    }

    return stats
}
