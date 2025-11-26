import React, { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Play, Save, FileCode, Lightbulb, Copy, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'

interface EditorProps {
  code: string
  setCode: (code: string) => void
  setSecurityScore: (score: number | null) => void
}

export default function Editor({ code, setCode, setSecurityScore }: EditorProps) {
  const [isCompiling, setIsCompiling] = useState(false)
  const [hasCompiled, setHasCompiled] = useState(false)

  const defaultCode = `// Qubic Smart Contract
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
};`

  const handleCompile = async () => {
    setIsCompiling(true)
    try {
      const data = await api.compile(code)

      if (data.success) {
        setHasCompiled(true)
        toast.success('✅ Compilation successful!')
        setTimeout(() => setHasCompiled(false), 3000)
      } else {
        toast.error('❌ Compilation failed')
      }
    } catch (error) {
      toast.error('Error compiling contract')
    } finally {
      setIsCompiling(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code || defaultCode)
    toast.success('Code copied to clipboard!')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="border-b border-surface-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileCode size={20} className="text-primary-600" />
          <div>
            <div className="text-sm font-semibold text-surface-900">contract.cpp</div>
            <div className="text-xs text-surface-500">C++ • Smart Contract</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className={`btn ${hasCompiled ? 'bg-secondary-600 hover:bg-secondary-700 text-white' : 'btn-primary'} text-sm flex items-center space-x-2`}
          >
            {hasCompiled ? (
              <>
                <CheckCircle size={16} />
                <span>Compiled</span>
              </>
            ) : isCompiling ? (
              <>
                <Play size={16} className="animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Compile</span>
              </>
            )}
          </button>

          <button
            onClick={copyCode}
            className="btn btn-secondary text-sm flex items-center space-x-2"
          >
            <Copy size={16} />
            <span>Copy</span>
          </button>

          <button className="btn btn-secondary text-sm flex items-center space-x-2">
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language="cpp"
          theme="vs"
          value={code || defaultCode}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            rulers: [80, 120],
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            formatOnPaste: true,
            formatOnType: true,
            roundedSelection: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalSliderSize: 12,
              horizontalSliderSize: 12,
            },
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-surface-200 px-6 py-3 text-sm bg-surface-50 flex items-center justify-between">
        <div className="flex items-center space-x-6 text-surface-600">
          <span>Lines: <span className="font-semibold text-surface-900">{code.split('\n').length}</span></span>
          <span>Characters: <span className="font-semibold text-surface-900">{code.length}</span></span>
          <span>Language: <span className="font-semibold text-primary-600">C++</span></span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="status-dot status-dot-active"></div>
          <span className="text-primary-600 font-medium">Qubic SDK Ready</span>
        </div>
      </div>
    </div>
  )
}
