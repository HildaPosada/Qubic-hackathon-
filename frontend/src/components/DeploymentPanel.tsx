import React, { useState } from 'react'
import { Rocket, Loader2, CheckCircle, ExternalLink, Copy, Zap, Shield, Gauge } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeploymentPanelProps {
  code: string
}

export default function DeploymentPanel({ code }: DeploymentPanelProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployment, setDeployment] = useState<any>(null)
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet')

  const handleDeploy = async () => {
    if (!code.trim()) {
      toast.error('No code to deploy')
      return
    }

    setIsDeploying(true)

    try {
      const response = await fetch(`/api/deploy/${network}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: 'temp_' + Date.now(),
          network
        })
      })

      const data = await response.json()

      if (data.success) {
        setDeployment(data.deployment)
        toast.success(`🚀 Deployed to ${network} successfully!`)
      } else {
        toast.error('Deployment failed')
      }
    } catch (error) {
      toast.error('Error deploying contract')
    } finally {
      setIsDeploying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-card to-dark-bg/50 border-b border-qubic-500/20 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/10 border border-green-500/30">
              <Rocket size={28} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Deploy Contract</h2>
              <p className="text-sm text-gray-400">Deploy to Qubic blockchain - instant, feeless, secure!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {!deployment ? (
          <>
            {/* Network Selection */}
            <div className="card p-6 bg-dark-card border-qubic-500/20">
              <h3 className="font-bold mb-4 text-lg text-gray-100">Select Deployment Network</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 'testnet',
                    name: 'Qubic Testnet',
                    description: 'Perfect for testing and development',
                    badge: 'Recommended',
                    badgeColor: 'from-green-600/20 to-green-900/10 border-green-600/30 text-green-300',
                    icon: '🧪',
                  },
                  {
                    id: 'mainnet',
                    name: 'Qubic Mainnet',
                    description: 'Production blockchain',
                    badge: 'Use with caution',
                    badgeColor: 'from-red-600/20 to-red-900/10 border-red-600/30 text-red-300',
                    icon: '🚀',
                  },
                ].map((net: any) => (
                  <button
                    key={net.id}
                    onClick={() => setNetwork(net.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left group ${
                      network === net.id
                        ? 'border-qubic-500 bg-qubic-600/10'
                        : 'border-dark-border hover:border-qubic-500/50 bg-dark-bg/50 hover:bg-dark-bg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{net.icon}</div>
                      <div className={`inline-block px-2 py-1 bg-gradient-to-br ${net.badgeColor} rounded text-xs font-semibold`}>
                        {net.badge}
                      </div>
                    </div>
                    <div className="font-bold text-gray-100 mb-1">{net.name}</div>
                    <div className="text-sm text-gray-400">{net.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Qubic Advantages */}
            <div className="card p-6 bg-dark-card border-qubic-500/20">
              <h3 className="font-bold mb-4 text-lg text-gray-100 flex items-center space-x-2">
                <Zap size={20} className="text-yellow-400" />
                <span>Why Deploy on Qubic?</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '⚡', title: 'Instant Finality', desc: 'No waiting for confirmations' },
                  { icon: '💰', title: 'Zero Fees', desc: 'Deploy completely free' },
                  { icon: '🚀', title: '15.5M TPS', desc: 'Lightning-fast transactions' },
                  { icon: '🏎️', title: 'C++ Performance', desc: 'Bare-metal execution speed' },
                ].map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-900/30 border border-qubic-500/20 group hover:border-qubic-500/50 transition-all">
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <div className="font-semibold text-gray-100 mb-1">{benefit.title}</div>
                    <div className="text-xs text-gray-400">{benefit.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !code.trim()}
              className="btn btn-primary w-full py-4 text-lg flex items-center justify-center space-x-3 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {isDeploying ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Deploying to {network}...</span>
                </>
              ) : (
                <>
                  <Rocket size={24} />
                  <span>Deploy to {network === 'testnet' ? 'Testnet' : 'Mainnet'}</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="card p-8 border-2 border-green-500/40 bg-gradient-to-br from-green-900/20 to-emerald-900/10 animate-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-full bg-green-500/20 border border-green-500/50">
                  <CheckCircle size={32} className="text-green-400 animate-bounce-light" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-400">Deployment Successful! 🎉</h3>
                  <p className="text-sm text-gray-400">Your contract is now live on Qubic</p>
                </div>
              </div>

              {/* Deployment Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-dark-bg/50 rounded-lg p-4 border border-qubic-500/20">
                  <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contract Address</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-900 px-4 py-3 rounded font-mono text-sm text-qubic-400 break-all">
                      {deployment.address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(deployment.address)}
                      className="btn btn-secondary p-2.5 flex items-center justify-center hover:bg-qubic-600/20"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-dark-bg/50 rounded-lg p-4 border border-qubic-500/20">
                  <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Transaction Hash</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-900 px-4 py-3 rounded font-mono text-sm text-qubic-400 break-all">
                      {deployment.transaction_hash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(deployment.transaction_hash)}
                      className="btn btn-secondary p-2.5 flex items-center justify-center hover:bg-qubic-600/20"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Deployment Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Shield, label: 'Network', value: deployment.network.charAt(0).toUpperCase() + deployment.network.slice(1) },
                  { icon: CheckCircle, label: 'Status', value: deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1), color: 'text-green-400' },
                  { icon: Zap, label: 'Gas Used', value: 'FREE', color: 'text-yellow-400' },
                  { icon: Gauge, label: 'Time', value: '< 1 sec' },
                ].map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div key={idx} className="bg-dark-bg/50 rounded-lg p-4 border border-qubic-500/20 flex items-center space-x-3">
                      <Icon size={20} className={stat.color || 'text-gray-400'} />
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">{stat.label}</div>
                        <div className={`font-bold ${stat.color || 'text-gray-200'}`}>{stat.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
                  <ExternalLink size={18} />
                  <span>View on Qubic Explorer</span>
                </button>

                <button
                  onClick={() => setDeployment(null)}
                  className="btn btn-secondary w-full"
                >
                  Deploy Another Contract
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
