import React from 'react'
import { Sparkles, Zap, Shield, Rocket, Activity } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-dark-card to-dark-bg border-b border-qubic-500/20 px-8 py-6 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center justify-between mb-6">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-qubic-500 to-qubic-700 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-qubic-400 to-qubic-600 rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="text-white" size={28} />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Qubic Studio
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              AI-Powered Smart Contract IDE
            </p>
          </div>
        </div>

        {/* Network & Wallet */}
        <div className="flex items-center space-x-4">
          {/* Network Status */}
          <div className="flex items-center space-x-3 bg-dark-bg/50 px-4 py-2 rounded-lg border border-qubic-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5">
                <div className="status-indicator status-indicator-success animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-300">Qubic Testnet</span>
              </div>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-qubic-400 font-medium">Connected</span>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button className="btn btn-primary flex items-center space-x-2 group relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <Rocket size={18} />
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Zap, label: '15.5M TPS', value: 'Blinding Speed', color: 'from-yellow-500 to-orange-500' },
          { icon: Shield, label: 'Zero Fees', value: 'Feeless Chain', color: 'from-green-500 to-emerald-500' },
          { icon: Sparkles, label: 'AI-Powered', value: 'Aigarth AI', color: 'from-purple-500 to-pink-500' },
          { icon: Activity, label: 'Instant', value: 'Finality Built-in', color: 'from-blue-500 to-cyan-500' },
        ].map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div
              key={idx}
              className="card px-4 py-3 bg-gradient-to-br from-dark-card to-dark-bg/50 hover:from-dark-card hover:to-dark-bg border-qubic-500/10 hover:border-qubic-500/30 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                  <Icon size={18} className="text-gray-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-400 truncate">{feature.label}</div>
                  <div className="text-sm font-bold text-gray-200 truncate">{feature.value}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}
