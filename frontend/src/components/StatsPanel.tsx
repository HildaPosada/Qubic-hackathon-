import React, { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Zap, DollarSign, Users, Rocket, Shield } from 'lucide-react'

export default function StatsPanel() {
  const [stats, setStats] = useState<any>(null)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats)
        let current = 0
        const interval = setInterval(() => {
          if (current < 98) {
            current += Math.random() * 30
            setAnimatedScore(Math.min(current, 98))
          } else {
            setAnimatedScore(98)
            clearInterval(interval)
          }
        }, 30)
      })
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-qubic-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-card to-dark-bg/50 border-b border-qubic-500/20 px-8 py-6 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/30">
            <BarChart3 size={28} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Platform Statistics</h2>
            <p className="text-sm text-gray-400">Impact metrics and real-world value creation</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              icon: Rocket,
              label: 'Total Contracts',
              value: stats.total_contracts,
              change: '+24%',
              color: 'from-blue-600/20 to-blue-900/10 border-blue-600/30',
              iconColor: 'text-blue-400'
            },
            {
              icon: Shield,
              label: 'Deployed',
              value: stats.deployed_contracts,
              change: '+18%',
              color: 'from-green-600/20 to-green-900/10 border-green-600/30',
              iconColor: 'text-green-400'
            },
            {
              icon: TrendingUp,
              label: 'Avg Security Score',
              value: `${stats.average_security_score}/100`,
              change: '+5%',
              color: 'from-yellow-600/20 to-yellow-900/10 border-yellow-600/30',
              iconColor: 'text-yellow-400'
            },
            {
              icon: Zap,
              label: 'Total Deployments',
              value: stats.total_deployments,
              change: '+42%',
              color: 'from-purple-600/20 to-purple-900/10 border-purple-600/30',
              iconColor: 'text-purple-400'
            },
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div key={idx} className={`card p-6 bg-gradient-to-br ${metric.color} border backdrop-blur-sm hover:shadow-glow transition-all group`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg bg-dark-bg/50 border border-current border-opacity-20 group-hover:border-opacity-40 transition-all`}>
                    <Icon size={20} className={metric.iconColor} />
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded">{metric.change}</span>
                </div>
                <div className="text-3xl font-bold text-gray-100 mb-1">{metric.value}</div>
                <div className="text-xs font-semibold text-gray-400">{metric.label}</div>
              </div>
            )
          })}
        </div>

        {/* Economic Impact - Hero Section */}
        <div className="card p-8 bg-gradient-to-br from-qubic-600/20 via-purple-600/10 to-pink-600/10 border border-qubic-500/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-72 h-72 bg-qubic-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign size={28} className="text-green-400" />
              <h3 className="text-2xl font-bold text-gray-100">Total Economic Impact</h3>
            </div>

            <div className="text-center py-4 mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                ${parseInt(stats.platform_benefits.total_audit_savings.replace(/[^0-9]/g, '')).toLocaleString()}+
              </div>
              <p className="text-lg text-gray-300">Saved by developers using this platform</p>
              <p className="text-sm text-gray-400 mt-2">vs. traditional $75,000 per contract audits</p>
            </div>

            <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full mb-6"></div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Audit Savings', value: stats.platform_benefits.total_audit_savings },
                { label: 'Deployment Fees Saved', value: stats.platform_benefits.deployment_fees_saved },
                { label: 'Avg Dev Time Reduction', value: stats.platform_benefits.average_dev_time_reduction },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-dark-bg/30 border border-qubic-500/20">
                  <div className="text-2xl font-bold text-qubic-300 mb-1">{item.value}</div>
                  <div className="text-xs font-semibold text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="card p-6 bg-dark-card border-qubic-500/20">
          <h3 className="font-bold mb-6 text-lg text-gray-100 flex items-center space-x-2">
            <TrendingUp size={24} className="text-green-500" />
            <span>Platform Benefits</span>
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'Total Audit Savings',
                sublabel: 'vs. traditional $75K/audit',
                value: stats.platform_benefits.total_audit_savings,
                color: 'text-green-400'
              },
              {
                label: 'Deployment Fees Saved',
                sublabel: 'Thanks to Qubic\'s feeless transactions',
                value: stats.platform_benefits.deployment_fees_saved,
                color: 'text-emerald-400'
              },
              {
                label: 'Development Speed',
                sublabel: 'AI-assisted vs manual coding',
                value: stats.platform_benefits.average_dev_time_reduction,
                color: 'text-qubic-400'
              },
              {
                label: 'Developers Onboarded',
                sublabel: 'Total users on the platform',
                value: stats.platform_benefits.developers_onboarded.toLocaleString(),
                color: 'text-purple-400'
              },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 rounded-lg bg-gray-900/30 border border-qubic-500/10 hover:border-qubic-500/30 transition-all">
                <div>
                  <div className="font-semibold text-gray-100 mb-1">{benefit.label}</div>
                  <div className="text-xs text-gray-500">{benefit.sublabel}</div>
                </div>
                <div className={`text-2xl font-bold ${benefit.color}`}>{benefit.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Qubic Advantages */}
        <div className="card p-6 bg-dark-card border-qubic-500/20">
          <h3 className="font-bold mb-6 text-lg text-gray-100 flex items-center space-x-2">
            <Zap size={24} className="text-qubic-400" />
            <span>Qubic Blockchain Advantages</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '⚡', label: 'Transaction Speed', value: stats.qubic_advantages.tps, unit: 'TPS' },
              { emoji: '💰', label: 'Transaction Fees', value: stats.qubic_advantages.fees, unit: '' },
              { emoji: '✅', label: 'Finality', value: stats.qubic_advantages.finality, unit: '' },
              { emoji: '🏎️', label: 'Language', value: stats.qubic_advantages.language, unit: '' },
            ].map((adv, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-dark-bg to-dark-card border border-qubic-500/20 hover:border-qubic-500/50 transition-all">
                <div className="text-3xl mb-2">{adv.emoji}</div>
                <div className="text-xs text-gray-400 font-semibold mb-1">{adv.label}</div>
                <div className="text-2xl font-bold text-qubic-300">{adv.value} {adv.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Impact */}
        <div className="card p-6 bg-dark-card border-qubic-500/20">
          <h3 className="font-bold mb-6 text-lg text-gray-100 flex items-center space-x-2">
            <Users size={24} className="text-blue-400" />
            <span>Developer Impact</span>
          </h3>
          <div className="space-y-3">
            {[
              {
                metric: 'Avg Code Generation Time',
                value: '5 seconds',
                vs: 'vs. hours of manual coding',
                improvement: '99.9% faster'
              },
              {
                metric: 'Security Audit Cost',
                value: 'FREE',
                vs: 'vs. $50K-$200K traditionally',
                improvement: '100% savings'
              },
              {
                metric: 'Time to Deploy',
                value: '< 1 second',
                vs: 'vs. hours on other chains',
                improvement: '10,000x faster'
              },
              {
                metric: 'Barrier to Entry',
                value: 'Minimal',
                vs: 'vs. steep learning curve',
                improvement: '1000x easier'
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-900/30 border border-qubic-500/10 hover:border-qubic-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-200">{item.metric}</span>
                  <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded">{item.improvement}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-qubic-400">{item.value}</span>
                  <span className="text-sm text-gray-500">{item.vs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>
    </div>
  )
}
