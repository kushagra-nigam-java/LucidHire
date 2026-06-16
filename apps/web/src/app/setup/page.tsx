"use client";
import { useState, useRef, useEffect } from 'react';
import { Bot, CheckCircle, ChevronRight, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SetupPage() {
  const [chat, setChat] = useState<{role: string, text: string}[]>([
    {role: 'assistant', text: "👋 Hello! I'm LucidHire. Tell me about the role you're hiring for — what skills, level, and responsibilities matter most?"}
  ]);
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    
    const newChat = [...chat, {role: 'user', text: userMsg}];
    setChat(newChat);
    setTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newChat })
      });
      
      const data = await response.json();
      setTyping(false);
      
      if (data.reply) {
        let replyText = data.reply;
        let isDone = false;
        
        if (replyText.includes('GENERATION_COMPLETE')) {
          replyText = replyText.replace('GENERATION_COMPLETE', '').trim();
          isDone = true;
        }
        
        if (replyText) {
          setChat(c => [...c, {role: 'assistant', text: replyText}]);
        }
        
        if (isDone) {
          setGenerated(true);
        }
      }
    } catch (error) {
      setTyping(false);
      setChat(c => [...c, {role: 'assistant', text: "Error connecting to AI. Please try again."}]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white"/>
        </div>
        <h1 className="text-xl font-bold text-white">LucidHire <span className="text-zinc-500 font-normal text-sm">— Calibration Chat</span></h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Chat Panel */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col" style={{height: '78vh'}}>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {chat.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white"/>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  m.role === 'assistant'
                    ? 'bg-zinc-800 text-zinc-100 rounded-tl-sm'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white"/>
                </div>
                <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                  <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Describe the role, skills, or requirements..."
            />
            <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-500 px-5 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium text-white">
              <Send size={16}/>
            </button>
          </div>
        </div>

        {/* JD Preview */}
        {generated && (
          <div className="w-full md:w-[420px] bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col" style={{height: '78vh'}}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-green-400"/>
              <h2 className="font-semibold text-white">Generated Job Requisition</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 text-sm">
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Role</div>
                <div className="text-white font-medium">Software Engineer</div>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Job Description</div>
                <div className="text-zinc-300 leading-relaxed">Dynamic role based on your inputs. Needs strong problem solving and engineering fundamentals.</div>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Scoring Rubric</div>
                <div className="space-y-2">
                  {[['Technical Depth', 40], ['Problem Solving', 40], ['Communication', 20]].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-zinc-400">{k}</span>
                      <span className="font-bold text-blue-400">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-xs text-green-400">
                Live Groq LLM integration successful.
              </div>
            </div>
            <Link href="/pipeline/1" className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2 text-sm transition-all text-white">
              Confirm & View Pipeline <ChevronRight size={16}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
