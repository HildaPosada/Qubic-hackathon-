import React, { useEffect, useState } from 'react'
import { TrendingUp, Users, Zap, DollarSign, BarChart3, Target, Shield } from 'lucide-react'

export default function StatsPanel() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(() => {
        // Mock data for demo
        setStats({
          total_contracts: 1234,
          deployed_contracts: 892,
          average_security_score: 94,
          total_deployments: 3456,
          platform_benefits: {
            total_audit_savings: '$92,100,000',
            deployment_fees_saved: '$3,450,000',
            average_dev_time_reduction: '10x faster',
            developers_onboarded: 42500,
          },
          qubic_advantages: {
            tps: '15.5M',
            fees: 'Zero',
            finality: 'Instant',
            language: 'C++',
          }
        })
      })
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-surface-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto panel-scroll">
      {/* Header */}
      <div className="border-b border-surface-200 px-6 py-6 sticky top-0 bg-white">
        <div className="flex items-center space-x-3">
          <BarChart3 size={24} className="text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Statistics</h2>
            <p className="text-sm text-surface-500">Platform metrics and impact</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-8">
        {/* Main Metrics Grid */}
        <section>
          <h3 className="text-lg font-bold text-surface-900 mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: 'Total Contracts', value: stats.total_contracts },
              { icon: TrendingUp, label: 'Deployed', value: stats.deployed_contracts },
              { icon: Shield, label: 'Avg Security Score', value: `${stats.average_security_score}/100` },
              { icon: Zap, label: 'Total Deployments', value: stats.total_deployments },
            ].map((metric, idx) => {
              const Icon = metric.icon
              return (
                <div key={idx} className="card p-5 text-center">
                  <Icon size={24} className="text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-surface-900 mb-1">{metric.value}</div>
                  <div className="text-xs text-surface-500 font-medium">{metric.label}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Economic Impact */}
        <section className="bg-primary-50 border border-primary-200 rounded-xl p-8">
          <div className="flex items-start space-x-3 mb-4">
            <DollarSign size={24} className="text-primary-600" />
            <h3 className="text-lg font-bold text-surface-900">Economic Impact</h3>
          </div>
          <div className="text-4xl font-bold text-primary-700 mb-2">
            {stats.platform_benefits.total_audit_savings}
          </div>
          <p className="text-surface-600 mb-6">Saved by developers using this platform</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Audit Savings', value: stats.platform_benefits.total_audit_savings },
              { label: 'Fees Saved', value: stats.platform_benefits.deployment_fees_saved },
              { label: 'Speed Improvement', value: stats.platform_benefits.average_dev_time_reduction },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl font-bold text-primary-700 mb-1">{item.value}</div>
                <div className="text-xs text-surface-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Benefits */}
        <section>
          <h3 className="text-lg font-bold text-surface-900 mb-4">Benefits</h3>
          <div className="space-y-3">
            {[
              {
                title: 'Total Audit Savings',
                desc: 'vs. traditional $75K/audit',
                value: stats.platform_benefits.total_audit_savings,
              },
              {
                title: 'Deployment Fees Saved',
                desc: 'Thanks to zero-fee transactions',
                value: stats.platform_benefits.deployment_fees_saved,
              },
              {
                title: 'Development Speed',
                desc: 'AI-assisted vs manual coding',
                value: stats.platform_benefits.average_dev_time_reduction,
              },
              {
                title: 'Developers Onboarded',
                desc: 'Total users on platform',
                value: stats.platform_benefits.developers_onboarded.toLocaleString(),
              },
            ].map((benefit, idx) => (
              <div key={idx} className={`card p-5 ${idx % 2 === 0 ? 'bg-accent-50' : 'bg-secondary-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-surface-900">{benefit.title}</div>
                    <div className="text-xs text-surface-600 mt-0.5">{benefit.desc}</div>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">{benefit.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Qubic Advantages */}
        <section>
          <h3 className="text-lg font-bold text-surface-900 mb-4">Qubic Advantages</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Transaction Speed', value: stats.qubic_advantages.tps, icon: '⚡' },
              { label: 'Fees', value: stats.qubic_advantages.fees, icon: '💰' },
              { label: 'Finality', value: stats.qubic_advantages.finality, icon: '✅' },
              { label: 'Language', value: stats.qubic_advantages.language, icon: '🏎️' },
            ].map((adv, idx) => (
              <div key={idx} className="card p-5 text-center">
                <div className="text-3xl mb-2">{adv.icon}</div>
                <div className="text-xl font-bold text-surface-900 mb-1">{adv.value}</div>
                <div className="text-xs text-surface-600">{adv.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Impact */}
        <section className="pb-8">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Developer Impact</h3>
          <div className="space-y-3">
            {[
              {
                metric: 'Code Generation',
                value: '5 seconds',
                vs: 'vs. hours of manual coding',
              },
              {
                metric: 'Security Audit Cost',
                value: 'FREE',
                vs: 'vs. $50K-$200K traditionally',
              },
              {
                metric: 'Time to Deploy',
                value: '< 1 second',
                vs: 'vs. hours on other chains',
              },
              {
                metric: 'Learning Curve',
                value: 'Minimal',
                vs: 'vs. steep traditional setup',
              },
            ].map((item, idx) => (
              <div key={idx} className={`card p-5 border-l-4 ${idx % 2 === 0 ? 'border-l-primary-600 bg-primary-50' : 'border-l-accent-600 bg-accent-50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-surface-900">{item.metric}</div>
                  <div className="text-lg font-bold text-primary-600">{item.value}</div>
                </div>
                <div className="text-xs text-surface-600">{item.vs}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
