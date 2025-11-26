import React, { useState } from 'react'
import { Sparkles, Zap, Code2, Lock, Rocket } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Header() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const handleConnectWallet = async () => {
    try {
      // Simulate wallet connection (in production, would connect to Qubic wallet)
      const mockAddress = 'QUBIC' + Math.random().toString(36).substring(2, 15).toUpperCase()
      setWalletAddress(mockAddress)
      setWalletConnected(true)
      toast.success('Wallet connected successfully!')
    } catch (error) {
      toast.error('Failed to connect wallet')
    }
  }

  const handleDisconnectWallet = () => {
    setWalletAddress('')
    setWalletConnected(false)
    toast.success('Wallet disconnected')
  }
  return (
    <header className="bg-white border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Section: Logo & Wallet */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Qubic Studio</h1>
              <p className="text-sm text-surface-500">AI-Powered Smart Contracts</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-surface-50 border border-surface-200">
              <div className="status-dot status-dot-active"></div>
              <span className="text-sm font-medium text-surface-700">Qubic Testnet</span>
            </div>
            {walletConnected ? (
              <button
                onClick={handleDisconnectWallet}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <div className="status-dot status-dot-active"></div>
                <span className="font-mono text-xs">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                </span>
              </button>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="btn btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Zap, label: '15.5M TPS', description: 'Lightning Fast' },
            { icon: Lock, label: 'AI Security', description: 'Always Audited' },
            { icon: Code2, label: 'C++ Native', description: 'High Performance' },
            { icon: Rocket, label: 'Instant Deploy', description: 'Zero Fees' },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-surface-50 border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <Icon size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-surface-700">{feature.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </header>
  )
}
