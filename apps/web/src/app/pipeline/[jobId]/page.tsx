"use client";
import { useEffect, useState } from 'react';
import { Play, Code, CheckCircle, Loader } from 'lucide-react';
import Link from 'next/link';

const STAGES = ["SOURCED", "SIGNAL_ANALYZED", "SANDBOXED", "REVIEW", "DECISION", "OFFER"];

export default function PipelineBoard({ params }: { params: { jobId: string } }) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Fake fetch for demo purposes
    setCandidates([
      { id: 1, name: 'Alice Developer', stage: 'SOURCED', score: null },
      { id: 2, name: 'Bob Coder', stage: 'SOURCED', score: null },
      { id: 3, name: 'Charlie Engineer', stage: 'REVIEW', score: 88 }
    ]);
  }, []);

  const runPipeline = (id: number) => {
    setEvents(prev => [...prev, `[Agent] Started evaluation pipeline for candidate ${id}`]);
    setTimeout(() => {
       setCandidates(cands => cands.map(c => c.id === id ? {...c, stage: 'SIGNAL_ANALYZED'} : c));
       setEvents(prev => [...prev, `[Agent] Ingested & Vectorized candidate ${id}`, `[Agent] Signal probe complete: ADVANCE`]);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold mb-8 lucid-gradient">LucidHire Pipeline</h1>
      
      <div className="flex gap-6 h-[70vh] overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="w-[300px] flex-shrink-0 glass-panel p-4 flex flex-col">
            <h3 className="font-semibold text-zinc-400 text-xs tracking-wider mb-4">{stage.replace('_', ' ')}</h3>
            <div className="space-y-3">
              {candidates.filter(c => c.stage === stage).map(c => (
                <div key={c.id} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                  <div className="font-medium text-zinc-100">{c.name}</div>
                  
                  {stage === 'SOURCED' && (
                    <button onClick={() => runPipeline(c.id)} className="mt-4 w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 p-2 rounded text-sm flex justify-center items-center gap-2">
                      <Play size={14}/> Run Agent
                    </button>
                  )}
                  {stage === 'SIGNAL_ANALYZED' && (
                    <Link href={`/assessment/${c.id}`} className="mt-4 w-full block text-center bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 p-2 rounded text-sm flex justify-center items-center gap-2">
                      <Code size={14}/> Enter Sandbox
                    </Link>
                  )}
                  {stage === 'REVIEW' && (
                    <Link href={`/candidate/${c.id}`} className="mt-4 w-full block text-center bg-green-600/20 text-green-400 hover:bg-green-600/30 p-2 rounded text-sm flex justify-center items-center gap-2">
                      <CheckCircle size={14}/> View Report
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 right-8 w-80 glass-panel rounded-b-none p-4 h-64 flex flex-col">
        <h4 className="text-sm font-semibold text-zinc-400 mb-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Live Activity Feed
        </h4>
        <div className="flex-1 overflow-y-auto text-xs space-y-2 font-mono text-zinc-300">
          {events.map((e, i) => (
             <div key={i}>{e}</div>
          ))}
          {events.length === 0 && <div className="text-zinc-600 italic">Waiting for events...</div>}
        </div>
      </div>
    </div>
  );
}
