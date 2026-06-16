"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { User } from 'lucide-react';
import { useState } from 'react';

const data = [
  { name: 'Technical', value: 85, color: '#3b82f6' },
  { name: 'Problem Solving', value: 92, color: '#8b5cf6' },
  { name: 'Communication', value: 80, color: '#10b981' },
];

export default function CandidateReport({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState<string | null>(null);

  const handleDecision = (choice: string) => {
    setDecision(choice);
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-blue-400"/> Alice Developer
          </h1>
          <p className="text-zinc-400 mt-1">Senior Backend Engineer Candidate</p>
        </div>
        
        {decision ? (
          <div className="glass-panel px-6 py-3 border border-green-500 text-green-400 font-bold bg-green-500/10">
            Decision Logged: {decision}. Logistics worker triggered.
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => handleDecision('NO_HIRE')} className="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded font-semibold border border-red-500/30 transition-colors">Reject</button>
            <button onClick={() => handleDecision('HIRE')} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-bold transition-colors">Hire</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4">Intelligence Narrative</h2>
            <p className="text-zinc-300 leading-relaxed">
              [DEMO MODE - MOCK LLM] The candidate successfully diagnosed and fixed the containerized microservice issue under the required time limit. Probe signals were strong, demonstrating deep knowledge of Python systems.
            </p>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-4">Evidence Snippets</h2>
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded border border-zinc-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Source: Resume</span>
                <p className="mt-2 text-sm text-zinc-300">"5 years of Python experience"</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded border border-zinc-800">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Source: Sandbox</span>
                <p className="mt-2 text-sm text-zinc-300">"Fixed failing API test in 42 seconds"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Score Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#18181b', border: 'none', borderRadius: '8px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
             {data.map(d => (
               <div key={d.name} className="flex justify-between text-sm">
                 <span className="text-zinc-400">{d.name}</span>
                 <span className="font-bold" style={{color: d.color}}>{d.value}/100</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
