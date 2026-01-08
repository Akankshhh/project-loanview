
'use client';
import React from 'react';
import { ShieldCheck, Bot, User, Send } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Simple, non-interactive message bubble
const MessageBubble = ({ message }: { message: { text: string; sender: 'bot' | 'user' } }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-1 shadow-sm ${isBot ? 'bg-teal-700 mr-3' : 'bg-slate-700 ml-3'}`}>
          {isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
        </div>
        <div className="flex flex-col">
          {isBot && <span className="text-xs font-bold text-teal-800 mb-1 ml-1">Banking & Loan Advisor</span>}
          <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-line border ${isBot ? 'bg-white text-slate-800 rounded-tl-none border-slate-200' : 'bg-teal-600 text-white rounded-tr-none border-teal-600'}`}>
            {message.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AIAdvisorPage() {
  const { t } = useI18n();

  const messages = [
    {
      id: 1,
      sender: 'bot' as const,
      text: "Hello! I am your Banking Advisor. This feature is currently in a non-interactive demo mode. Please check back later for full functionality."
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl flex flex-col h-[calc(100vh-12rem)] animate-in fade-in-0 duration-500">
      <CardHeader>
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle>{t('nav.bankingAdvisor')}</CardTitle>
        </div>
        <CardDescription>Your AI-powered guide for banking and loan queries.</CardDescription>
      </CardHeader>
      
      {/* Chat Feed */}
      <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </CardContent>

      {/* Input Area - Disabled */}
      <div className="bg-card border-t p-4 md:p-6 z-10 rounded-b-xl">
        <div className="w-full relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            placeholder="This feature is currently disabled."
            className="flex-1 bg-transparent px-6 py-4 outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            disabled={true}
          />
          <button 
            disabled={true}
            className={`p-3 mr-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
}
