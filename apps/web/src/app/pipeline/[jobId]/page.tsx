"use client";
import { useState } from 'react';
import { Play, Code, CheckCircle, Loader2, Users, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

const STAGES = ["SOURCED", "SIGNAL_ANALYZED", "SANDBOXED", "REVIEW", "DECISION", "OFFER"];

const STAGE_COLORS: Record<string, string> = {
  SOURCED: "text-zinc-400",
  SIGNAL_ANALYZED: "text-blue-400",
  SANDBOXED: "text-purple-400",
  REVIEW: "text-yellow-400",
  DECISION: "text-orange-400",
  OFFER: "text-green-400",
};

const INITIAL_CANDIDATES = [
  { id: 1, name: 'Alice Developer', stage: 'SOURCED', score: null, source: 'LinkedIn' },
  { id: 2, name: 'Bob Coder', stage: 'SOURCED', score: null, source: 'GitHub' },
  { id: 3, name: 'Charlie Engineer', stage: 'REVIEW', score: 88, source: 'Referral' },
];

export default function PipelineBoard() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [events, setEvents] = useState<string[]>([
    "[Agent] Pipeline initialized. 3 candidates loaded.",
  ]);
  const [running, setRunning] = useState<number | null>(null);

  const addEvent = (msg: string) => setEvents(e => [...e, msg]);

  const runPipeline = (id: number, name: string) => {
    setRunning(id);
    addEvent(`[Agent] Starting evaluation pipeline for ${name}...`);

    setTimeout(() => {
      addEvent(`[Agent] Ingesting resume & vectorizing profile for ${name}...`);
    }, 800);
    setTimeout(() => {
      addEvent(`[Agent] Signal probe complete → Decision: ADVANCE`);
      setCandidates(c => c.map(x => x.id === id ? {...x, stage: 'SIGNAL_ANALYZED'} : x));
    }, 2000);
    setTimeout(() => {
      addEvent(`[Agent] Sandbox container ready. Awaiting recruiter patch submission.`);
      setRunning(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white"/>
            </div>
            LucidHire Pipeline
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Senior Backend Engineer — Job #1</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Users size={14}/> {candidates.length} candidates
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{height: '65vh'}}>
        {STAGES.map(stage => {
          const stageCandidates = candidates.filter(c => c.stage === stage);
          return (
            <div key={stage} className="w-[260px] flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold text-xs tracking-wider uppercase ${STAGE_COLORS[stage]}`}>
                  {stage.replace(/_/g, ' ')}
                </h3>
                {stageCandidates.length > 0 && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">{stageCandidates.length}</span>
                )}
              </div>
              <div className="space-y-3 flex-1">
                {stageCandidates.map(c => (
                  <div key={c.id} className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl hover:border-zinc-600 transition-colors">
                    <div className="font-medium text-white text-sm">{c.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{c.source}</div>
                    {c.score && (
                      <div className="mt-2 text-xs font-bold text-green-400">Score: {c.score}/100</div>
                    )}
                    <div className="mt-3">
                      {stage === 'SOURCED' && (
                        <button
                          onClick={() => runPipeline(c.id, c.name)}
                          disabled={running === c.id}
                          className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/20 p-2 rounded-lg text-xs flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          {running === c.id ? <Loader2 size={12} className="animate-spin"/> : <Play size={12}/>}
                          {running === c.id ? 'Analyzing...' : 'Run Agent'}
                        </button>
                      )}
                      {stage === 'SIGNAL_ANALYZED' && (
                        <Link href={`/assessment/${c.id}`} className="w-full block bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/20 p-2 rounded-lg text-xs text-center flex justify-center items-center gap-2 transition-colors">
                          <Code size={12}/> Enter Sandbox
                        </Link>
                      )}
                      {stage === 'REVIEW' && (
                        <Link href={`/candidate/${c.id}`} className="w-full block bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 border border-yellow-500/20 p-2 rounded-lg text-xs text-center flex justify-center items-center gap-2 transition-colors">
                          <CheckCircle size={12}/> View Report
                        </Link>
                      )}
                      {stage === 'OFFER' && (
                        <div className="w-full text-center text-xs text-green-400 font-semibold">🎉 Offer Sent</div>
                      )}
                    </div>
                  </div>
                ))}
                {stageCandidates.length === 0 && (
                  <div className="text-center text-zinc-700 text-xs pt-4">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Feed */}
      <div className="fixed bottom-0 right-6 w-80 bg-zinc-900 border border-zinc-800 border-b-0 rounded-t-2xl p-4 h-52 flex flex-col shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-3">
          <Activity size={12} className="text-green-400"/>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
          Live Activity Feed
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs text-zinc-400">
          {events.map((e, i) => (
            <div key={i} className="leading-relaxed">{e}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
