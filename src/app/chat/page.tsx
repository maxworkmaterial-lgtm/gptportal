'use client';
import { useState, useRef, useEffect } from 'react';
import ThemedDotGrid from '@/components/ThemedDotGrid';

const textModels = [
  { id: 'gpt-5.4', name: 'ChatGPT 5.4', icon: '🟢', cost: 575, color: '#10a37f' },
  { id: 'gpt-5.2', name: 'ChatGPT 5.2', icon: '🟢', cost: 672, color: '#10a37f' },
  { id: 'gpt-5-nano', name: 'GPT-5 Nano', icon: '⚡', cost: 170, color: '#10a37f' },
  { id: 'gpt-5-mini', name: 'GPT-5 Mini', icon: '🔵', cost: 340, color: '#3b82f6' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: '🟣', cost: 450, color: '#8b5cf6' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', icon: '💎', cost: 890, color: '#4285f4' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: '💎', cost: 750, color: '#4285f4' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', icon: '⚡', cost: 200, color: '#4285f4' },
  { id: 'grok-4', name: 'Grok 4', icon: '🅧', cost: 960, color: '#1d9bf0' },
  { id: 'grok-4-fast', name: 'Grok 4 Fast', icon: '🅧', cost: 480, color: '#1d9bf0' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
}

const demoChatHistory: Chat[] = [
  { id: '1', title: 'Маркетинговая стратегия для стартапа', messages: [], model: 'ChatGPT 5.4', createdAt: Date.now() - 3600000 },
  { id: '2', title: 'Рефакторинг API на Go', messages: [], model: 'Gemini 3.1 Pro', createdAt: Date.now() - 7200000 },
  { id: '3', title: 'Перевод документации на английский', messages: [], model: 'GPT-5 Nano', createdAt: Date.now() - 86400000 },
  { id: '4', title: 'Анализ конкурентов в нише EdTech', messages: [], model: 'Grok 4', createdAt: Date.now() - 172800000 },
];

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState(textModels[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory] = useState<Chat[]>(demoChatHistory);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: prompt, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'Отличный вопрос! Давайте разберём это по порядку.\n\nВо-первых, стоит обратить внимание на ключевые метрики, которые помогут оценить эффективность вашего подхода. Я бы рекомендовал начать с анализа текущей ситуации.\n\nВо-вторых, для достижения лучших результатов можно использовать комбинированный подход — это позволит охватить больше аспектов проблемы.',
        'Вот несколько вариантов решения:\n\n**1. Быстрый подход** — реализовать MVP за 2-3 дня с базовым функционалом.\n\n**2. Оптимальный подход** — потратить неделю на продуманную архитектуру.\n\n**3. Комплексный подход** — полный цикл разработки с тестированием.\n\nРекомендую начать с первого варианта для валидации идеи.',
        'На основе анализа данных могу сказать следующее:\n\n- Рынок растёт на 25% год к году\n- Основные конкуренты: компании A, B и C\n- Ваше конкурентное преимущество — скорость и UX\n\nМогу подготовить подробный отчёт с графиками, если нужно.',
      ];
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        model: selectedModel.name,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  };

  return (
    <div className="relative min-h-screen" onClick={() => setShowModelPicker(false)}>
      <ThemedDotGrid />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-header flex items-center justify-between px-8 py-4 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-primary)' }}>Чат</h1>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] hover:opacity-80 transition"
                style={{ background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)', color: 'var(--t-text-primary)' }}
              >
                <span>{selectedModel.icon}</span>
                <span className="font-medium">{selectedModel.name}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--t-text-muted)' }}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {showModelPicker && (
                <div className="glass-dropdown absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden z-50 p-1.5 max-h-[400px] overflow-y-auto">
                  {textModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition`}
                      style={{ background: selectedModel.id === m.id ? 'var(--t-active)' : undefined }}
                      onMouseEnter={(e) => { if (selectedModel.id !== m.id) e.currentTarget.style.background = 'var(--t-hover)'; }}
                      onMouseLeave={(e) => { if (selectedModel.id !== m.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span className="text-base">{m.icon}</span>
                      <div className="flex-1">
                        <div className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{m.name}</div>
                        <div className="text-[9px]" style={{ color: 'var(--t-text-muted)' }}>⚡ {m.cost}</div>
                      </div>
                      {selectedModel.id === m.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>⚡ 3 000</span>
        </header>

        {/* Chat area */}
        <div className="flex-1 flex">
          {/* Chat history sidebar */}
          <div className="w-[220px] shrink-0 border-r overflow-y-auto" style={{ borderColor: 'var(--t-glass-border)', background: 'color-mix(in srgb, var(--t-sidebar) 80%, transparent)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <div className="p-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold hover:opacity-90 transition mb-3" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                Новый чат
              </button>
              <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--t-text-faint)' }}>Сегодня</p>
              {chatHistory.slice(0, 2).map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition truncate mb-0.5"
                  style={{ color: 'var(--t-text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--t-hover)'; e.currentTarget.style.color = 'var(--t-text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-secondary)'; }}
                >
                  {chat.title}
                </button>
              ))}
              <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2 mt-4" style={{ color: 'var(--t-text-faint)' }}>Вчера</p>
              {chatHistory.slice(2).map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition truncate mb-0.5"
                  style={{ color: 'var(--t-text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--t-hover)'; e.currentTarget.style.color = 'var(--t-text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-secondary)'; }}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--t-hover)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border)' }}>
                    {selectedModel.icon}
                  </div>
                  <div className="text-center">
                    <h2 className="text-[18px] font-bold mb-1" style={{ color: 'var(--t-text-primary)' }}>{selectedModel.name}</h2>
                    <p className="text-[13px] max-w-md" style={{ color: 'var(--t-text-muted)' }}>Задайте вопрос, напишите текст, проанализируйте данные или получите креативные идеи</p>
                  </div>
                  {/* Quick starters */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-lg">
                    {['Напиши маркетинговый план', 'Проанализируй конкурентов', 'Создай контент-план на месяц', 'Напиши код на Python'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setPrompt(s); textareaRef.current?.focus(); }}
                        className="glass-subtle px-3.5 py-2 rounded-xl text-[11px] hover:opacity-80 transition"
                        style={{ color: 'var(--t-text-secondary)' }}
                      >
                        ✦ {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm mt-1" style={{ background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)' }}>
                          {selectedModel.icon}
                        </div>
                      )}
                      <div
                        className="max-w-[75%] rounded-2xl px-4 py-3"
                        style={msg.role === 'user'
                          ? { background: 'var(--t-user-msg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-user-msg-border)' }
                          : { background: 'var(--t-ai-msg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-ai-msg-border)' }
                        }
                      >
                        <div className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--t-text-primary)' }}>{msg.content}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px]" style={{ color: 'var(--t-text-faint)' }}>
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.role === 'assistant' && msg.model && (
                            <span className="text-[9px]" style={{ color: 'var(--t-text-faint)' }}>• {msg.model}</span>
                          )}
                          {msg.role === 'assistant' && (
                            <button className="ml-auto transition" style={{ color: 'var(--t-text-faint)' }} title="Копировать">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            </button>
                          )}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm mt-1" style={{ background: 'var(--t-user-msg)' }}>
                          👤
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm mt-1" style={{ background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)' }}>
                        {selectedModel.icon}
                      </div>
                      <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--t-ai-msg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-ai-msg-border)' }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', opacity: 0.4, animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', opacity: 0.4, animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', opacity: 0.4, animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 glass-bar px-8 py-4">
              <div className="max-w-3xl mx-auto flex items-end gap-3">
                <button onClick={() => {}} className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition" style={{ background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)', color: 'var(--t-text-muted)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <div className="flex-1 rounded-2xl overflow-hidden glass-input">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => { setPrompt(e.target.value); autoResize(); }}
                    placeholder="Напишите сообщение..."
                    rows={1}
                    className="w-full px-4 pt-3 pb-3 bg-transparent text-[14px] outline-none resize-none"
                    style={{ maxHeight: '150px', color: 'var(--t-text-primary)', '--tw-placeholder-opacity': 1 } as React.CSSProperties}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (isRecording) {
                      setIsRecording(false);
                      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
                    } else {
                      setIsRecording(true);
                      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                        const mr = new MediaRecorder(stream);
                        mediaRecorderRef.current = mr;
                        mr.start();
                        mr.onstart = () => {};
                        mr.onstop = () => {
                          stream.getTracks().forEach((t) => t.stop());
                          setIsRecording(false);
                          setPrompt((prev) => prev || 'Голосовое сообщение получено. Обработка...');
                        };
                      }).catch(() => setIsRecording(false));
                    }
                  }}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : ''
                  }`}
                  style={isRecording ? undefined : { background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)', color: 'var(--t-text-muted)' }}
                  title={isRecording ? 'Остановить запись' : 'Голосовой ввод'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="1" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>
                </button>
                <button
                  onClick={handleSend}
                  disabled={!prompt.trim() || isTyping}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition ${
                    prompt.trim() && !isTyping
                      ? 'shadow-lg'
                      : ''
                  }`}
                  style={
                    prompt.trim() && !isTyping
                      ? { background: 'var(--accent)', color: 'var(--t-accent-text)', boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--accent) 20%, transparent)' }
                      : { background: 'var(--t-badge-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--t-border2)', color: 'var(--t-text-faint)' }
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
              </div>
              <p className="text-center text-[10px] mt-2" style={{ color: 'var(--t-text-faint)' }}>⚡ {selectedModel.cost} за сообщение • {selectedModel.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
