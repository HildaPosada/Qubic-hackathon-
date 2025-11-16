import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, MessageSquare, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface AIAssistantProps {
  code: string
  setCode: (code: string) => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  id?: string
}

export default function AIAssistant({ code, setCode }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m Aigarth, your AI assistant powered by Qubic. I can help you:\n\n• Generate smart contracts from descriptions\n• Explain your code\n• Find and fix bugs\n• Optimize performance\n\nWhat would you like to build?'
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    { icon: '🪙', label: 'Create a token contract', text: 'Create a voting contract' },
    { icon: '🏛️', label: 'Build a voting contract', text: 'Build a token contract with supply cap' },
    { icon: '🎨', label: 'Make an NFT contract', text: 'Create an NFT contract' },
    { icon: '🔒', label: 'Create an escrow contract', text: 'Create an escrow contract' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGenerate = async (customPrompt?: string) => {
    const userPrompt = customPrompt || prompt
    if (!userPrompt.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt
    }

    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      })

      const data = await response.json()

      if (data.success) {
        setCode(data.code)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `✅ **Contract Generated Successfully!**\n\n${data.explanation}\n\n**Quick Tips:**\n${data.suggestions.map((s: string) => `• ${s}`).join('\n')}\n\nFeel free to edit the code in the editor or ask me for modifications!`
        }

        setMessages(prev => [...prev, assistantMessage])
        toast.success('Contract generated! Check the editor →')
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Sorry, I couldn\'t generate that contract. Could you provide more details or try rephrasing your request?'
        }
        setMessages(prev => [...prev, errorMessage])
        toast.error('Failed to generate contract')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ An error occurred while generating your contract. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Error generating contract')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-dark-card to-dark-bg border-l border-qubic-500/20 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-qubic-500/20 bg-gradient-to-r from-dark-card to-dark-bg/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 bg-opacity-20 border border-purple-500/30">
            <Sparkles size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-100">Aigarth AI Assistant</h3>
            <p className="text-xs text-gray-500">Powered by Qubic's AI layer</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-qubic-600 to-qubic-700 text-white shadow-md'
                  : 'bg-dark-bg border border-qubic-500/20 text-gray-200'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start animate-in">
            <div className="bg-dark-bg border border-qubic-500/20 rounded-xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-qubic-400" />
                <span className="text-sm text-gray-300">Generating your contract...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-qubic-500/20">
          <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center space-x-2">
            <Zap size={14} className="text-yellow-500" />
            <span>Quick Start</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleGenerate(p.text)}
                disabled={isGenerating}
                className="text-left text-xs btn btn-secondary py-2 px-2.5 hover:bg-qubic-600/20 hover:border-qubic-500/50 transition-all group"
              >
                <div className="flex items-start space-x-1.5">
                  <span className="text-base mt-0.5">{p.icon}</span>
                  <span className="text-gray-300 group-hover:text-white font-medium">{p.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-qubic-500/20 bg-gradient-to-t from-dark-card to-dark-bg/50 backdrop-blur-sm">
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
            placeholder="Describe your smart contract..."
            className="input flex-1 text-sm"
            disabled={isGenerating}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="btn btn-primary p-2.5 flex items-center justify-center relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Describe what you want and I'll generate the code
        </p>
      </div>
    </div>
  )
}
