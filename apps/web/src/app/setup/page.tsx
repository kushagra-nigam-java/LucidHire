"use client";
import { useState } from 'react';
import { Bot, CheckCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
  const [chat, setChat] = useState<{role: string, text: string}[]>([
    {role: 'agent', text: 'Hello! I am LucidHire. What kind of role are you hiring for today?'}
  ]);
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleSend = () => {
    if(!input) return;
    setChat([...chat, {role: 'human', text: input}]);
    setInput("");
    setTimeout(() => {
      setChat(c => [...c, {role: 'agent', text: 'I have analyzed your request. I generated a full Job Description and a scoring rubric. Would you like to review them?'}]);
      setGenerated(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
      <div className="flex-1 glass-panel p-6 flex flex-col h-[80vh]">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bot className="text-blue-400"/> Calibration Chat</h2>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chat.map((m, i) => (
            <div key={i} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'agent' ? 'bg-zinc-800 self-start' : 'bg-blue-600 self-end ml-auto'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white"
            placeholder="Type your requirements..."
          />
          <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg font-semibold transition-colors">Send</button>
        </div>
      </div>
      
      {generated && (
        <div className="w-[400px] glass-panel p-6 flex flex-col h-[80vh] animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-400"/> Job Requisition</h2>
          <div className="flex-1 overflow-y-auto text-sm space-y-4 text-zinc-300">
            <div><strong className="text-white">Title:</strong> Senior Backend Engineer</div>
            <div><strong className="text-white">Generated JD:</strong><br/>We are looking for a Senior Backend Engineer to build and maintain our core microservices. You must be proficient in Python, Flask/FastAPI, and Docker.</div>
            <div><strong className="text-white">Rubric:</strong><br/>- Technical: 40%<br/>- Problem Solving: 40%<br/>- Communication: 20%</div>
            <div className="p-3 bg-zinc-800 rounded text-xs mt-4">[DEMO MODE] Data is mocked.</div>
          </div>
          <Link href="/pipeline/1" className="mt-4 bg-indigo-600 hover:bg-indigo-500 p-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2 transition-colors">
            Confirm & Create Requisition <ChevronRight size={18}/>
          </Link>
        </div>
      )}
    </div>
  );
}
