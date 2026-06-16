import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Use the Groq API key from environment variables
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Llama 3 on Groq for fast inference
        messages: [
          {
            role: "system",
            content: "You are LucidHire, an AI recruitment copilot. Keep responses extremely concise (1-2 sentences). Ask clarifying questions about the role. Once you have enough info (after 2-3 turns), say EXACTLY 'GENERATION_COMPLETE' at the end of your message to trigger the pipeline."
          },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.text
          }))
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Groq API error:", data);
      return NextResponse.json({ error: "Failed to fetch from LLM provider" }, { status: 500 });
    }

    return NextResponse.json({ 
      reply: data.choices[0].message.content 
    });
    
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
