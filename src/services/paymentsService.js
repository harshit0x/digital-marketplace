import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

/**
 * Create a checkout session for purchasing a listing
 */
export async function createCheckoutSession(listingId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to make a purchase')
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single()

    if (listingError) {
        throw new Error('Listing not found')
    }

    if (!listing) {
        throw new Error('Listing not found')
    }

    if (listing.user_id === user.id) {
        throw new Error('You cannot purchase your own listing')
    }

    if (listing.status !== 'active') {
        throw new Error('This listing is no longer available')
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            listing_id: listingId,
            buyer_id: user.id,
            seller_id: listing.user_id,
            amount: listing.price,
            platform_fee: listing.price * 0.05, // 5% platform fee
            status: 'pending',
        })
        .select()
        .single()

    if (orderError) {
        console.error('Error creating order:', orderError)
        throw new Error('Failed to create order')
    }

    // For now, we'll use a simple redirect to Stripe Checkout
    // In production, you'd call your backend to create a Stripe session
    const checkoutUrl = `${window.location.origin}/checkout/${order.id}`

    return {
        orderId: order.id,
        checkoutUrl,
        listing,
        amount: listing.price,
    }
}

/**
 * Get order details
 */
export async function getOrder(orderId) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            listing:listing_id (
                id,
                title,
                platform,
                username,
                screenshots
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
        `)
        .eq('id', orderId)
        .single()

    if (error) throw error
    return data
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status, paymentIntentId = null) {
    const updates = { status }
    if (paymentIntentId) {
        updates.stripe_payment_intent_id = paymentIntentId
    }
    if (status === 'paid') {
        updates.paid_at = new Date().toISOString()
    }

    const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Get user's orders (as buyer)
 */
export async function getUserOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            listing:listing_id (
                id,
                title,
                platform,
                price
            ),
            seller:seller_id (
                full_name,
                email
            )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Get user's sales (as seller)
 */
export async function getUserSales() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            listing:listing_id (
                id,
                title,
                platform,
                price
            ),
            buyer:buyer_id (
                full_name,
                email
            )
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export { stripePromise }
