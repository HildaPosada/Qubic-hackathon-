/**
 * API Client that works in both dev and production
 * In production (builder.io), uses mock data
 * In development, connects to backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.PROD;

// Mock data for production/standalone mode
const mockGenerateResponse = (prompt: string) => ({
  success: true,
  code: `// Qubic Smart Contract Generated from: "${prompt}"
// Leverages 15.5M TPS and feeless transactions

#include <qubic.h>

struct QubicContract {
    uint64_t value;

    PUBLIC void setValue(uint64_t newValue) {
        require(newValue > 0, "Value must be positive");
        value = newValue;
    }

    PUBLIC uint64_t getValue() const {
        return value;
    }
};`,
  explanation: `Generated a Qubic smart contract based on: "${prompt}". This contract leverages Qubic's 15.5M TPS and feeless transactions for optimal performance.`,
  suggestions: [
    "✅ Contract uses Qubic's instant finality for real-time operations",
    "✅ Leverages feeless transactions for unlimited interactions",
    "💡 Consider adding event logging for better transparency",
    "🔒 Run security audit before deployment"
  ],
  estimated_complexity: "medium",
  execution_time: 0.5
});

const mockAuditResponse = (code: string) => ({
  success: true,
  score: 95,
  issues: [
    {
      severity: "low",
      category: "Code Quality",
      line: 1,
      column: 0,
      message: "Consider adding more comprehensive input validation",
      fix: "Add require() or assert() statements for all inputs"
    }
  ],
  summary: "Security audit complete. Overall security score: 95/100. Found 1 potential issue. Contract PASSED audit.",
  recommendations: [
    "✅ Contract structure follows Qubic best practices",
    "✅ Leverages Qubic's feeless transactions efficiently",
    "💡 Consider adding more comprehensive input validation",
    "🔒 Conduct thorough testing before mainnet deployment"
  ],
  execution_time: 0.3,
  passed: true
});

const mockDeployResponse = () => ({
  success: true,
  deployment: {
    id: `deploy_${Date.now()}`,
    contract_id: `contract_${Date.now()}`,
    network: "testnet",
    address: `QUBIC${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    transaction_hash: `0x${Math.random().toString(36).substring(2, 15)}`,
    timestamp: new Date().toISOString(),
    status: "confirmed",
    gas_used: 0,
    ipo_config: null
  },
  message: "✅ Contract deployed to testnet successfully! Thanks to Qubic's instant finality, your contract is live immediately!",
  execution_time: 0.5
});

export const api = {
  async generate(prompt: string, template?: string) {
    if (IS_MOCK_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGenerateResponse(prompt);
    }

    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, template })
    });
    return response.json();
  },

  async audit(code: string, contractName?: string) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAuditResponse(code);
    }

    const response = await fetch(`${API_BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, contract_name: contractName })
    });
    return response.json();
  },

  async deploy(contractId: string, network: 'testnet' | 'mainnet') {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDeployResponse();
    }

    const response = await fetch(`${API_BASE_URL}/api/deploy/${network}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_id: contractId, network })
    });
    return response.json();
  },

  async compile(code: string) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        compiled: true,
        bytecode: `0x${Math.random().toString(36).substring(2, 15)}`,
        size_bytes: code.length,
        warnings: [],
        errors: [],
        message: "✅ Compilation successful!"
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return response.json();
  },

  async getStats() {
    if (IS_MOCK_MODE) {
      return {
        success: true,
        stats: {
          total_contracts: 157,
          deployed_contracts: 89,
          average_security_score: 87.5,
          total_deployments: 89,
          platform_benefits: {
            total_audit_savings: "$11,250,000",
            deployment_fees_saved: "$0 (Qubic is feeless!)",
            average_dev_time_reduction: "10x faster",
            developers_onboarded: 1247
          },
          qubic_advantages: {
            tps: "15.5M",
            fees: "Zero",
            finality: "Instant",
            language: "C++"
          }
        }
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/stats`);
    return response.json();
  }
};
