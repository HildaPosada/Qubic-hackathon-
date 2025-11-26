import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Loader2, Zap } from 'lucide-react'
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
      content: 'Hello! 👋 I\'m Aigarth, your AI assistant. I can help you:\n\n• Generate smart contracts from plain English\n• Explain your code\n• Find and fix security issues\n• Optimize performance\n\nWhat would you like to build today?'
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'Create a voting contract',
    'Build a token contract',
    'Make an NFT contract',
    'Create an escrow contract'
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
          content: `✅ Contract generated!\n\n${data.explanation}\n\n**Tips:**\n${data.suggestions.map((s: string) => `• ${s}`).join('\n')}`
        }

        setMessages(prev => [...prev, assistantMessage])
        toast.success('Contract generated!')
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Sorry, I couldn\'t generate that contract. Could you provide more details?'
        }
        setMessages(prev => [...prev, errorMessage])
        toast.error('Failed to generate contract')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ An error occurred. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Error generating contract')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-surface-50 border-l border-surface-100">
      {/* Header */}
      <div className="border-b border-surface-100 px-6 py-5 bg-white">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h3 className="font-bold text-surface-900">Aigarth AI</h3>
        </div>
        <p className="text-xs text-surface-500 font-medium">Powered by Qubic's AI Layer</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md'
                  : 'bg-white text-surface-900 border border-surface-100 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-surface-100 rounded-xl px-4 py-3 flex items-center space-x-2 shadow-sm">
              <Loader2 size={16} className="animate-spin text-primary-600" />
              <span className="text-sm text-surface-700">Generating...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 border-t border-surface-100 bg-white">
          <div className="text-xs font-bold text-surface-600 mb-3 flex items-center space-x-2">
            <Zap size={14} className="text-accent-600" />
            <span>Quick Start</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleGenerate(p)}
                disabled={isGenerating}
                className="text-xs py-2 px-3 rounded-lg bg-white border border-surface-100 text-surface-700 hover:border-primary-300 hover:bg-primary-50 transition-all text-left font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-surface-100 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
            placeholder="Describe your smart contract..."
            className="input flex-1 text-sm bg-surface-50 border-surface-200"
            disabled={isGenerating}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
