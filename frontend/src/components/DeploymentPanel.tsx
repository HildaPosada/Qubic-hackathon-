import React, { useState } from 'react'
import { Rocket, Loader2, CheckCircle, ExternalLink, Copy, Shield, Gauge, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'

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
      const data = await api.deploy('temp_' + Date.now(), network)

      if (data.success) {
        setDeployment(data.deployment)
        toast.success(`Deployed to ${network} successfully!`)
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-surface-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Rocket size={24} className="text-secondary-600" />
            <div>
              <h2 className="text-2xl font-bold text-surface-900">Deploy Contract</h2>
              <p className="text-sm text-surface-500">Deploy to Qubic blockchain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scroll px-6 py-8">
        {!deployment ? (
          <>
            {/* Network Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-surface-900 mb-4">Select Network</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 'testnet',
                    name: 'Testnet',
                    description: 'For testing and development',
                    recommended: true,
                  },
                  {
                    id: 'mainnet',
                    name: 'Mainnet',
                    description: 'Production blockchain',
                    recommended: false,
                  },
                ].map((net: any) => (
                  <button
                    key={net.id}
                    onClick={() => setNetwork(net.id)}
                    className={`card p-6 text-left transition-all ${
                      network === net.id
                        ? 'border-primary-300 bg-primary-50 shadow-md'
                        : 'hover:border-surface-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-surface-900">{net.name}</div>
                      {net.recommended && (
                        <span className="badge badge-primary text-xs">Recommended</span>
                      )}
                    </div>
                    <p className="text-sm text-surface-600">{net.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-surface-900 mb-4">Why Qubic?</h3>
              <div className="space-y-3">
                {[
                  { icon: Zap, label: 'Instant Finality', desc: 'No waiting for confirmations' },
                  { icon: Gauge, label: 'Zero Fees', desc: 'Deploy completely free' },
                  { icon: Shield, label: 'Secure', desc: '15.5M TPS guaranteed' },
                ].map((benefit, idx) => {
                  const Icon = benefit.icon
                  return (
                    <div key={idx} className="flex items-start space-x-4 p-4 card">
                      <Icon size={20} className="text-primary-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-surface-900">{benefit.label}</div>
                        <div className="text-sm text-surface-600">{benefit.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !code.trim()}
              className="btn btn-primary w-full py-3 text-base flex items-center justify-center space-x-2"
            >
              {isDeploying ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Rocket size={20} />
                  <span>Deploy to {network === 'testnet' ? 'Testnet' : 'Mainnet'}</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-secondary-100 mb-4">
                <CheckCircle size={40} className="text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900 mb-2">Deployment Successful</h3>
              <p className="text-surface-600">Your contract is now live on Qubic</p>
            </div>

            {/* Deployment Info */}
            <div className="space-y-4 mb-8">
              <div className="card p-4">
                <div className="text-xs font-semibold text-surface-500 mb-2 uppercase">Contract Address</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm font-mono text-primary-600 truncate">{deployment.address}</code>
                  <button
                    onClick={() => copyToClipboard(deployment.address)}
                    className="btn btn-secondary p-2"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="card p-4">
                <div className="text-xs font-semibold text-surface-500 mb-2 uppercase">Transaction Hash</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-sm font-mono text-primary-600 truncate">{deployment.transaction_hash}</code>
                  <button
                    onClick={() => copyToClipboard(deployment.transaction_hash)}
                    className="btn btn-secondary p-2"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Network', value: deployment.network },
                { label: 'Status', value: deployment.status },
                { label: 'Gas Used', value: 'Free' },
                { label: 'Time', value: '< 1 sec' },
              ].map((stat, idx) => (
                <div key={idx} className="card p-4">
                  <div className="text-xs text-surface-500 font-semibold mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-surface-900 capitalize">{stat.value}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
              <ExternalLink size={18} />
              <span>View on Explorer</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
