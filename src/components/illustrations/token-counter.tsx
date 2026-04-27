'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
    id: number
    sender: 'agent' | 'buyer'
    text: string
    time: string
}

const initialMessages: Message[] = [
    {
        id: 1,
        sender: 'agent',
        text: "Hi! I have an off-market property in your price range in the neighborhood you're looking at. Would you like to hear more?",
        time: '2:34 PM'
    }
]

const conversationFlow: Message[] = [
    {
        id: 2,
        sender: 'buyer',
        text: "Yes, definitely interested! What's the address?",
        time: '2:35 PM'
    },
    {
        id: 3,
        sender: 'agent',
        text: "It's 1247 Oak Street in Thousand Oaks. 4 bed, 3 bath, 2,400 sqft. Listed at $1.2M but not on MLS yet.",
        time: '2:36 PM'
    },
    {
        id: 4,
        sender: 'buyer',
        text: "That sounds perfect! Can we schedule a tour?",
        time: '2:37 PM'
    },
    {
        id: 5,
        sender: 'agent',
        text: "Absolutely! I have availability tomorrow at 10am or 2pm. Which works better for you?",
        time: '2:38 PM'
    },
    {
        id: 6,
        sender: 'buyer',
        text: "2pm works great. See you then!",
        time: '2:39 PM'
    }
]

export const TokenCounterIllustration = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [isAnimating, setIsAnimating] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const startConversation = () => {
        if (isAnimating) return
        
        setIsAnimating(true)
        setMessages(initialMessages)
        setCurrentIndex(0)

        // Animate messages one by one
        conversationFlow.forEach((message, index) => {
            setTimeout(() => {
                setMessages(prev => [...prev, message])
                setCurrentIndex(index + 1)
                
                if (index === conversationFlow.length - 1) {
                    setIsAnimating(false)
                }
            }, (index + 1) * 1500) // 1.5 seconds between messages
        })
    }

    return (
        <div className="min-w-sm max-w-md w-full">
            <div className="px-6 pt-1">
                <div className="bg-white rounded-2xl px-2 pt-4 shadow-xl ring-1 ring-gray-200">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                                <Image 
                                    src="/avatars/danny-postma.jpg" 
                                    alt="Danny Postma" 
                                    width={32} 
                                    height={32}
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-gray-900 font-semibold">Danny Postma</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>

                    {/* Messages Container */}
                    <div 
                        className="bg-gray-50 rounded-xl px-4 py-5 shadow-inner ring-1 ring-gray-100 h-[450px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-2 ${message.sender === 'agent' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        {message.sender === 'buyer' ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                                                <Image 
                                                    src="/avatars/danny-postma.jpg" 
                                                    alt="Danny Postma" 
                                                    width={32} 
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#5BA8A8] flex items-center justify-center ring-2 ring-white">
                                                <Image 
                                                    src="/logos/mark.svg" 
                                                    alt="Agent" 
                                                    width={16} 
                                                    height={16}
                                                    className="brightness-0 invert"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`flex flex-col ${message.sender === 'agent' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                        <div className="text-[10px] text-gray-500 mb-1 px-1">
                                            {message.sender === 'buyer' ? 'Danny Postma' : 'MasterKey Agent'}
                                        </div>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 ${
                                                message.sender === 'buyer'
                                                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                                                    : 'bg-[#5BA8A8] text-white shadow-md'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 px-1">
                                            {message.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Scroll anchor */}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Action Button / Message Input */}
                    <div className="px-4 py-4">
                        {isAnimating ? (
                            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 border border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Message"
                                    disabled
                                    className="flex-1 bg-transparent text-sm text-gray-500 outline-none cursor-not-allowed"
                                />
                                <button
                                    disabled
                                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-not-allowed opacity-50"
                                >
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={startConversation}
                                className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 bg-[#5BA8A8] text-white hover:bg-[#4a9090] shadow-md hover:shadow-lg"
                            >
                                Start Conversation
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TokenCounterIllustration