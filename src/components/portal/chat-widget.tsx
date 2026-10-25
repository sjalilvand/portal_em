'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone, Send, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const STORAGE_KEY = 'emdad-chat';

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

function saveMessages(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-60)));
  } catch {
    /* ignore */
  }
}

export function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [unread, setUnread] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate history
  useEffect(() => {
    const history = loadMessages();
    if (history.length > 0) {
      setMessages(history);
    } else {
      setMessages([{ id: 'welcome', role: 'bot', text: t('chat.welcome', 'سلام! 🌹 من دستیار هوشمند کمیته امداد هستم. چطور می‌توانم کمکتان کنم؟') }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length) saveMessages(messages);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Reset unread dot when opened
  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  // Stop in-flight request on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || typing) return;
    setInput('');
    const userMsg: ChatMessage = { id: 'u' + Date.now(), role: 'user', text: msg };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    setSuggestions([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      // Small human-like delay
      pollRef.current = setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: 'b' + Date.now(), role: 'bot', text: data.reply || 'پاسخی دریافت نشد.' }]);
        setSuggestions(data.suggestions || []);
      }, 650);
    } catch {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: 'b' + Date.now(), role: 'bot', text: 'ارتباط برقرار نشد؛ لطفا دوباره تلاش کنید یا با ۱۴۹۸ تماس بگیرید.' },
      ]);
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        initial={{ scale: 0, rotate: 30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('chat.open', 'چت آنلاین')}
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-2xl hero-gradient text-primary-foreground shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-transform"
        style={{ height: 52, width: 52 }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && unread && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-amber-950 shadow">
            ۱
          </span>
        )}
        {!open && <span className="absolute inset-0 rounded-2xl pulse-ring" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            role="dialog"
            aria-label={t('chat.title', 'چت آنلاین')}
            className="fixed bottom-[4.75rem] right-4 z-50 flex h-[540px] max-h-[80vh] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between hero-gradient px-4 py-3.5 text-primary-foreground">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Bot size={20} />
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-black">{t('chat.title', 'چت آنلاین')}</p>
                  <p className="text-[10px] opacity-85">{t('chat.subtitle', 'پشتیبانی آنلاین امداد — آنلاین')}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t('common.close', 'بستن')} className="rounded-lg p-1.5 hover:bg-white/15">
                <X size={17} />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4 scroll-thin">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', m.role === 'user' ? 'justify-start' : 'justify-end')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-6 shadow-sm',
                      m.role === 'user'
                        ? 'rounded-bl-sm bg-primary text-primary-foreground'
                        : 'rounded-br-sm border bg-card'
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-br-sm border bg-card px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-primary/60"
                      />
                    ))}
                  </div>
                </div>
              )}
              {suggestions.length > 0 && !typing && (
                <div className="flex flex-wrap justify-end gap-1.5 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Operator note */}
            <div className="flex items-center gap-1.5 border-t bg-muted/50 px-4 py-2 text-[10px] text-muted-foreground">
              <Phone size={11} className="text-primary" />
              {t('chat.operatorNote', 'برای گفتگو با کارشناس، ۱۴۹۸ را شبانه‌روزی تماس بگیرید')}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t bg-background p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder', 'پیام خود را بنویسید...')}
                className="rounded-full bg-muted/60"
                aria-label={t('chat.placeholder', 'متن پیام')}
              />
              <Button type="submit" size="icon" disabled={typing || !input.trim()} className="h-10 w-10 shrink-0 rounded-full" aria-label={t('chat.send', 'ارسال')}>
                <Send size={16} className="scale-x-[-1]" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
