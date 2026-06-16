"use client";
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { PlayCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentSandbox({ params }: { params: { runId: string } }) {
  const [code, setCode] = useState(`--- a/app.py
+++ b/app.py
@@ -5,3 +5,3 @@
 def health_check():
-    return jsonify({"status": "down"}), 500
+    return jsonify({"status": "ok"}), 200
`);
  const [logs, setLogs] = useState("");
  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    setLogs("Starting sandbox container...\\nApplying patch...\\nRunning pytest...");
    setTimeout(() => {
      setLogs(l => l + "\\n\\ntest_app.py . [100%]\\n\\n============== 1 passed in 0.05s ==============\\n\\n[SUBPROCESS FALLBACK — NOT ISOLATED, NOT FOR UNTRUSTED CODE BEYOND A DEMO]");
      setRunning(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold lucid-gradient">Sandbox Workbench</h1>
        <div className="text-sm px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 flex items-center gap-2">
          <AlertTriangle size={14}/> Demo Mode: Acting on behalf of candidate {params.runId}
        </div>
      </div>
      
      <div className="flex flex-1 gap-6 h-[75vh]">
        <div className="w-2/3 glass-panel overflow-hidden flex flex-col">
          <div className="bg-zinc-950 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800 flex justify-between">
            <span>patch.diff</span>
            <button onClick={runTests} disabled={running} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold disabled:opacity-50">
              <PlayCircle size={16}/> {running ? 'Running...' : 'Run Tests'}
            </button>
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            language="diff"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        <div className="w-1/3 glass-panel p-4 flex flex-col">
          <h3 className="font-semibold text-zinc-400 text-sm mb-2">Terminal Output</h3>
          <div className="flex-1 bg-black rounded p-3 font-mono text-xs text-green-400 overflow-y-auto whitespace-pre-wrap">
            {logs}
          </div>
          {logs.includes("passed") && (
             <Link href={`/pipeline/1`} className="mt-4 block bg-indigo-600 hover:bg-indigo-500 p-3 rounded font-semibold text-center text-sm transition-colors">
               Return to Pipeline
             </Link>
          )}
        </div>
      </div>
    </div>
  );
}
