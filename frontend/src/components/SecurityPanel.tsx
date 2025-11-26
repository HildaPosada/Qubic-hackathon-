import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'

interface SecurityPanelProps {
  code: string
  securityScore: number | null
  setSecurityScore: (score: number) => void
}

export default function SecurityPanel({ code, securityScore, setSecurityScore }: SecurityPanelProps) {
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState<any>(null)

  const handleAudit = async () => {
    if (!code.trim()) {
      toast.error('No code to audit')
      return
    }

    setIsAuditing(true)

    try {
      const data = await api.audit(code, 'MyContract')

      if (data.success) {
        setAuditResult(data)
        setSecurityScore(data.score)
        toast.success(`Audit complete! Score: ${data.score}/100`)
      } else {
        toast.error('Audit failed')
      }
    } catch (error) {
      toast.error('Error auditing contract')
    } finally {
      setIsAuditing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'high': return 'border-orange-200 bg-orange-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-blue-200 bg-blue-50'
      case 'info': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      critical: '🔴 Critical',
      high: '🟠 High',
      medium: '🟡 Medium',
      low: '🔵 Low',
      info: 'ℹ️ Info'
    }
    return labels[severity] || 'Info'
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-secondary-600'
    if (score >= 80) return 'text-primary-600'
    if (score >= 70) return 'text-highlight-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Fair'
    return 'Needs Work'
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-surface-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield size={24} className="text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-surface-900">Security Audit</h2>
              <p className="text-sm text-surface-500">AI-powered vulnerability detection</p>
            </div>
          </div>

          <button
            onClick={handleAudit}
            disabled={isAuditing || !code.trim()}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isAuditing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Run Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto panel-scroll px-6 py-6">
        {!auditResult && !isAuditing && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <Shield size={48} className="mx-auto text-surface-300 mb-4" />
              <h3 className="text-lg font-bold text-surface-900 mb-2">No Audit Results</h3>
              <p className="text-surface-600 text-sm">
                Run a security audit to detect vulnerabilities and get recommendations.
              </p>
            </div>
          </div>
        )}

        {auditResult && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-surface-900 mb-2">Security Score</h3>
                  <p className="text-sm text-surface-600">{auditResult.summary}</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(auditResult.score)}`}>
                    {auditResult.score}
                  </div>
                  <div className="text-xs text-surface-500 mt-1">/ 100</div>
                  <div className="text-xs font-semibold text-surface-700 mt-2">
                    {getScoreLabel(auditResult.score)}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      auditResult.score >= 90 ? 'bg-secondary-600' :
                      auditResult.score >= 80 ? 'bg-primary-600' :
                      auditResult.score >= 70 ? 'bg-highlight-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${auditResult.score}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                {auditResult.passed ? (
                  <div className="flex items-center space-x-2 text-secondary-700 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                    <CheckCircle size={18} />
                    <span className="font-medium">Contract passed audit</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-700 p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle size={18} />
                    <span className="font-medium">Contract needs improvements</span>
                  </div>
                )}
              </div>
            </div>

            {/* Issues */}
            {auditResult.issues && auditResult.issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-surface-900">Issues Found ({auditResult.issues.length})</h3>
                {auditResult.issues.map((issue: any, idx: number) => (
                  <div
                    key={idx}
                    className={`card p-4 border-l-4 ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-surface-900">
                        {getSeverityLabel(issue.severity)} • {issue.category}
                      </span>
                    </div>
                    <p className="text-sm text-surface-700 mb-2">{issue.message}</p>
                    {issue.fix && (
                      <div className="mt-2 p-2 bg-white rounded text-xs text-surface-600 border border-surface-100">
                        <span className="font-medium">Fix: </span>{issue.fix}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {auditResult.recommendations && auditResult.recommendations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-surface-900">Recommendations</h3>
                <div className="space-y-2">
                  {auditResult.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3 p-4 card">
                      <CheckCircle size={18} className="text-secondary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-surface-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
