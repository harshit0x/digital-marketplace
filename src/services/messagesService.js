import { supabase } from '../lib/supabase'

/**
 * Get all conversations for the current user
 */
export async function getConversations() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to view conversations')
    }

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            listing:listing_id (
                id,
                title,
                platform,
                price
            ),
            buyer:buyer_id (
                id,
                full_name,
                avatar_url
            ),
            seller:seller_id (
                id,
                full_name,
                avatar_url
            )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        throw error
    }

    return data
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId) {
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id (
                id,
                full_name,
                avatar_url
            )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        throw error
    }

    return data
}

/**
 * Send a message
 */
export async function sendMessage(conversationId, content) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to send messages')
    }

    // Insert the message
    const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content,
        })
        .select()
        .single()

    if (messageError) {
        console.error('Error sending message:', messageError)
        throw messageError
    }

    // Update conversation's last message
    const { error: updateError } = await supabase
        .from('conversations')
        .update({
            last_message: content,
            last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId)

    if (updateError) {
        console.error('Error updating conversation:', updateError)
    }

    return message
}

/**
 * Start a new conversation
 */
export async function startConversation(sellerId, listingId, initialMessage) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('You must be logged in to start a conversation')
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .eq('listing_id', listingId)
        .single()

    if (existing) {
        // Send message to existing conversation
        if (initialMessage) {
            await sendMessage(existing.id, initialMessage)
        }
        return existing
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            listing_id: listingId,
            last_message: initialMessage || '',
            last_message_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating conversation:', error)
        throw error
    }

    // Send initial message if provided
    if (initialMessage) {
        await sendMessage(conversation.id, initialMessage)
    }

    return conversation
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)

    if (error) {
        console.error('Error marking messages as read:', error)
    }
}

/**
 * Get unread message count
 */
export async function getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 0

    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id)

    if (error) {
        console.error('Error getting unread count:', error)
        return 0
    }

    return count || 0
}
