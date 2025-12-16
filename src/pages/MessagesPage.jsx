import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Search, Send, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../services/messagesService'
import { supabase } from '../lib/supabase'

export default function MessagesPage() {
    const { user } = useAuth()
    const location = useLocation()
    const messagesEndRef = useRef(null)

    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Load conversations on mount
    useEffect(() => {
        if (user) {
            fetchConversations()
        }
    }, [user])

    // Auto-select conversation from navigation state
    useEffect(() => {
        if (location.state?.conversationId && conversations.length > 0) {
            const conv = conversations.find(c => c.id === location.state.conversationId)
            if (conv) {
                setSelectedConversation(conv)
            }
        }
    }, [location.state, conversations])

    // Load messages when conversation selected
    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id)
            subscribeToMessages(selectedConversation.id)
        }
    }, [selectedConversation])

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchConversations = async () => {
        try {
            setLoading(true)
            const data = await getConversations()
            setConversations(data)
        } catch (err) {
            console.error('Error fetching conversations:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (conversationId) => {
        try {
            const data = await getMessages(conversationId)
            setMessages(data)
            await markMessagesAsRead(conversationId)
        } catch (err) {
            console.error('Error fetching messages:', err)
        }
    }

    const subscribeToMessages = (conversationId) => {
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new])
                    if (payload.new.sender_id !== user.id) {
                        markMessagesAsRead(conversationId)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedConversation) return

        try {
            setSending(true)
            await sendMessage(selectedConversation.id, newMessage.trim())
            setNewMessage('')
        } catch (err) {
            console.error('Error sending message:', err)
        } finally {
            setSending(false)
        }
    }

    const getOtherUser = (conversation) => {
        if (!user || !conversation) return null
        return conversation.buyer_id === user.id
            ? conversation.seller
            : conversation.buyer
    }

    const filteredConversations = conversations.filter(conv => {
        const other = getOtherUser(conv)
        const searchLower = searchQuery.toLowerCase()
        return (
            other?.full_name?.toLowerCase().includes(searchLower) ||
            other?.email?.toLowerCase().includes(searchLower) ||
            conv.listing?.title?.toLowerCase().includes(searchLower)
        )
    })

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
    }

    const formatDate = (date) => {
        if (!date) return ''
        const d = new Date(date)
        if (isNaN(d.getTime())) return ''

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (d.toDateString() === today.toDateString()) return 'Today'
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-120px)] flex"
                >
                    {/* Conversations List */}
                    <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'
                        }`}>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="input-field pl-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => {
                                    const other = getOtherUser(conv)
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left ${selectedConversation?.id === conv.id ? 'bg-primary-50' : ''
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                {other?.full_name?.charAt(0) || other?.email?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-900 truncate">
                                                        {other?.full_name || other?.email || 'User'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(conv.last_message_at || conv.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {conv.listing?.title}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="py-16 text-center">
                                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-2">No conversations yet</p>
                                    <p className="text-sm text-gray-400 px-4">
                                        Start a chat with a seller from a listing page
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'
                        }`}>
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedConversation(null)}
                                        className="md:hidden p-2 -ml-2 text-gray-500"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                        {getOtherUser(selectedConversation)?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {getOtherUser(selectedConversation)?.full_name || 'User'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {selectedConversation.listing?.title}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender_id === user.id
                                                    ? 'bg-primary-500 text-white rounded-br-md'
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                    }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-primary-100' : 'text-gray-400'
                                                        }`}>
                                                        {formatTime(msg.created_at)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="input-field flex-1"
                                            disabled={sending}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500">Select a conversation to start chatting</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
