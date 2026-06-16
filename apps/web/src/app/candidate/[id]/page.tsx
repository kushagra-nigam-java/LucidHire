"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { User, Shield, Zap, FileText } from 'lucide-react';
import { useState } from 'react';

const data = [
  { name: 'Technical Depth', value: 85, color: '#3b82f6' },
  { name: 'Problem Solving', value: 92, color: '#8b5cf6' },
  { name: 'Communication', value: 80, color: '#10b981' },
];

export default function CandidateReport({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState<string | null>(null);

  const handleDecision = (choice: string) => {
    setDecision(choice);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-400"/>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Candidate #{params.id}</h1>
            <p className="text-zinc-400 mt-1 flex items-center gap-2">
              <Shield size={14}/> Senior Backend Engineer Profile
            </p>
          </div>
        </div>
        
        {decision ? (
          <div className="px-6 py-3 rounded-xl border border-green-500/50 bg-green-500/10 text-green-400 font-bold text-sm flex items-center gap-2">
            Decision Logged: {decision} — Triggering Logistics Worker...
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => handleDecision('NO_HIRE')} className="px-6 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-semibold border border-red-500/20 transition-colors text-sm">Reject</button>
            <button onClick={() => handleDecision('HIRE')} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-500/20">Hire Candidate</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Narrative */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400"/> Intelligence Narrative
            </h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm">
              <p>
                The candidate successfully diagnosed and fixed the containerized microservice issue in <strong>38 seconds</strong>, demonstrating deep knowledge of Python systems and REST API conventions.
              </p>
              <p>
                Their patch correctly identified that the <code>/health</code> endpoint was returning a 500 status code intentionally. The fix was clean and adhered to standard JSON response formats.
              </p>
            </div>
          </div>

          {/* Evidence Snippets */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={16} className="text-blue-400"/> Evidence Snippets
            </h2>
            <div className="space-y-3">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"/>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Source: Sandbox</span>
                </div>
                <p className="text-sm text-zinc-300 font-mono bg-zinc-900 p-2 rounded">
                  {`+ return jsonify({"status": "ok"}), 200`}
                </p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"/>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Source: Resume Signal</span>
                </div>
                <p className="text-sm text-zinc-300">
                  "Maintained core microservices for 3 years using Flask and Docker."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6 text-center">Score Breakdown</h2>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px'}}
                  itemStyle={{color: '#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-white">86</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Overall</span>
            </div>
          </div>
          <div className="space-y-3 mt-6 flex-1">
             {data.map(d => (
               <div key={d.name} className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}/>
                   <span className="text-zinc-300">{d.name}</span>
                 </div>
                 <span className="font-bold text-white">{d.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
