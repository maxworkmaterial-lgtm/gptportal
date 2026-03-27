'use client';
import { useState, useRef, useCallback } from 'react';
import ThemedDotGrid from '@/components/ThemedDotGrid';

const models = [
  { id: 'nb-pro', name: 'Nano Banana Pro', icon: '🌈', cost: 55, badge: 'PRO', color: '#f59e0b' },
  { id: 'nb-2', name: 'Nano Banana 2', icon: '🍌', cost: 24, badge: null, color: '#fbbf24' },
  { id: 'gpt-img', name: 'GPT Image 1.5', icon: '🎨', cost: 10, badge: null, color: '#10a37f' },
  { id: 'grok-img', name: 'Grok Imagine', icon: '🅧', cost: 16, badge: null, color: '#1d9bf0' },
];

const aspects = ['1:1', '9:16', '16:9', '4:3', '3:4'];
const qualities = ['Auto', '2K', '4K'];

interface AttachedImage {
  id: string;
  url: string;
  name: string;
}

interface GenerationResult {
  url: string;
  prompt: string;
  model: string;
  aspect: string;
  quality: string;
  refs: AttachedImage[];
  timestamp: number;
}

export default function ImagesPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('9:16');
  const [quality, setQuality] = useState('4K');
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), url: e.target?.result as string, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeAttached = (id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGenerate = () => {
    if (!prompt && attachedImages.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      const [w, h] = aspect === '9:16' ? [360, 640] : aspect === '16:9' ? [640, 360] : aspect === '4:3' ? [480, 360] : aspect === '3:4' ? [360, 480] : [480, 480];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a1a2e"/><stop offset="100%" style="stop-color:#0f0f1a"/></linearGradient></defs>
        <rect fill="url(#bg)" width="${w}" height="${h}"/>
        <circle cx="${w * 0.3}" cy="${h * 0.4}" r="${Math.min(w, h) * 0.15}" fill="rgba(209,254,23,0.06)"/>
        <circle cx="${w * 0.7}" cy="${h * 0.6}" r="${Math.min(w, h) * 0.2}" fill="rgba(124,92,255,0.04)"/>
        <text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" fill="#d1fe17" font-size="18" font-family="sans-serif" font-weight="600">Generated</text>
        <text x="${w / 2}" y="${h / 2 + 16}" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="12" font-family="sans-serif">${selectedModel.name} • ${aspect} • ${quality}</text>
      </svg>`;
      setResult({
        url: 'data:image/svg+xml,' + encodeURIComponent(svg),
        prompt: prompt || 'Reference-based generation',
        model: selectedModel.name,
        aspect,
        quality,
        refs: [...attachedImages],
        timestamp: Date.now(),
      });
      setIsGenerating(false);
    }, 2500);
  };

  const handleCopyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `gptportal-${Date.now()}.png`;
    a.click();
  };

  const handleRetry = () => {
    handleGenerate();
  };

  const closeDropdowns = () => {
    setShowModelPicker(false);
  };

  return (
    <div className="relative min-h-screen" onClick={closeDropdowns}>
      <ThemedDotGrid />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-header flex items-center justify-between px-8 py-4 shrink-0 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-secondary)' }}>Генерация изображений</h1>
          <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>⚡ 3 000</span>
        </header>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Canvas area */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {result && !isGenerating ? (
              <div className="relative group">
                <img
                  src={result.url}
                  alt="Generated"
                  className="max-h-[70vh] max-w-full rounded-2xl"
                  style={{ boxShadow: '0 25px 50px -12px var(--t-shadow)', border: '1px solid var(--t-border)' }}
                  draggable={false}
                />
                {/* Quick actions overlay — bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[12px] text-white/70 hover:text-white transition" title="Скачать">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Скачать
                  </button>
                  <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[12px] text-white/70 hover:text-white transition" title="Повторить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                    Повторить
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:opacity-90 transition" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)', boxShadow: '0 10px 15px -3px rgba(209,254,23,0.2)' }} title="Оживить">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Оживить
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border)' }}>
                    <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '2px solid color-mix(in srgb, var(--accent) 40%, transparent)', borderTopColor: 'var(--accent)' }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium" style={{ color: 'var(--t-text-secondary)' }}>Генерация...</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--t-text-faint)' }}>{selectedModel.name} • {aspect} • {quality}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-3xl border-2 border-dashed flex items-center justify-center transition" style={{ borderColor: 'var(--t-border2)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--t-text-faint)' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-medium transition" style={{ color: 'var(--t-text-muted)' }}>Загрузите изображение или напишите промпт</p>
                  <p className="text-[12px] mt-1.5" style={{ color: 'var(--t-text-faint)' }}>Перетащите файл или нажмите сюда</p>
                </div>
              </div>
            )}
          </div>

          {/* Right info panel — appears after generation */}
          {result && !isGenerating && (
            <aside className="w-[320px] shrink-0 glass-panel overflow-y-auto">
              <div className="p-5 space-y-5">
                {/* Prompt section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Промпт
                    </div>
                    <button
                      onClick={handleCopyPrompt}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition"
                      style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-muted)' }}
                    >
                      {copied ? '✓ Скопировано' : 'Copy'}
                    </button>
                  </div>

                  {/* Reference images */}
                  {result.refs.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {result.refs.map((ref) => (
                        <div key={ref.id} className="relative">
                          <img src={ref.url} alt={ref.name} className="w-14 h-14 object-cover rounded-xl" style={{ border: '1px solid var(--t-border2)' }} />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{result.prompt}</p>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'var(--t-border)' }} />

                {/* Information section */}
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--t-text-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    Информация
                  </div>
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--t-border)' }}>
                      <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>Модель</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{result.model}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--t-border)' }}>
                      <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>Качество</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{result.quality}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--t-border)' }}>
                      <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>Соотношение</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{result.aspect}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--t-border)' }}>
                      <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>Размер</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>
                        {result.aspect === '9:16' ? '3072×5504' : result.aspect === '16:9' ? '5504×3072' : result.aspect === '4:3' ? '4096×3072' : result.aspect === '3:4' ? '3072×4096' : '4096×4096'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>Референсы</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{result.refs.length > 0 ? `${result.refs.length} шт.` : 'Нет'}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'var(--t-border)' }} />

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[13px] font-semibold hover:opacity-90 transition" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)', boxShadow: '0 10px 15px -3px rgba(209,254,23,0.15)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Оживить
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleRetry} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition" style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                      Повторить
                    </button>
                    <button onClick={handleDownload} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition" style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      Скачать
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Bottom prompt bar — always visible */}
        <div className="shrink-0 glass-bar px-8 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Attached images preview */}
            {attachedImages.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {attachedImages.map((img) => (
                  <div key={img.id} className="relative group/thumb shrink-0">
                    <img src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded-xl" style={{ border: '1px solid var(--t-border2)' }} />
                    <button
                      onClick={() => removeAttached(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-500/80 transition opacity-0 group-hover/thumb:opacity-100"
                      style={{ background: 'var(--t-card-solid)', border: '1px solid var(--t-border2)', color: 'var(--t-text-muted)' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-xl border border-dashed flex items-center justify-center transition"
                  style={{ borderColor: 'var(--t-border2)', color: 'var(--t-text-faint)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            )}

            <div className="flex items-end gap-3">
              {/* Attach button */}
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition"
                style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-muted)' }}
                title="Прикрепить изображение"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>

              {/* Input area */}
              <div className="flex-1 rounded-2xl overflow-hidden glass-input">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the scene you imagine"
                  rows={1}
                  className="w-full px-4 pt-3 pb-2 bg-transparent text-[14px] outline-none resize-none"
                  style={{ color: 'var(--t-text-primary)', '--tw-placeholder-opacity': 1 } as React.CSSProperties}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
                  }}
                />

                {/* Controls row */}
                <div className="flex items-center gap-2 px-4 pb-3">
                  {/* Model picker */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition"
                      style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)' }}
                    >
                      <span>{selectedModel.icon}</span>
                      <span className="font-medium">{selectedModel.name}</span>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--t-text-faint)' }}><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    {showModelPicker && (
                      <div className="glass-dropdown absolute bottom-full left-0 mb-2 w-56 rounded-xl overflow-hidden z-50 p-1.5">
                        {models.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition"
                            style={selectedModel.id === m.id ? { background: 'color-mix(in srgb, var(--accent) 8%, transparent)' } : {}}
                            onMouseEnter={(e) => { if (selectedModel.id !== m.id) (e.currentTarget as HTMLElement).style.background = 'var(--t-hover)'; }}
                            onMouseLeave={(e) => { if (selectedModel.id !== m.id) (e.currentTarget as HTMLElement).style.background = ''; }}
                          >
                            <span className="text-base">{m.icon}</span>
                            <div className="flex-1">
                              <div className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: 'var(--t-text-secondary)' }}>
                                {m.name}
                                {m.badge && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}>{m.badge}</span>}
                              </div>
                              <div className="text-[9px] mt-0.5" style={{ color: 'var(--t-text-muted)' }}>⚡ {m.cost}</div>
                            </div>
                            {selectedModel.id === m.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Aspect */}
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)' }}>
                    {aspects.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAspect(a)}
                        className="px-2 py-1.5 text-[10px] font-medium transition"
                        style={aspect === a
                          ? { background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }
                          : { color: 'var(--t-text-muted)' }
                        }
                      >
                        {a}
                      </button>
                    ))}
                  </div>

                  {/* Quality */}
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)' }}>
                    {qualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className="px-2.5 py-1.5 text-[10px] font-medium transition"
                        style={quality === q
                          ? { background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }
                          : { color: 'var(--t-text-muted)' }
                        }
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Cost display */}
                  <span className="text-[10px] ml-auto" style={{ color: 'var(--t-text-faint)' }}>⚡ {selectedModel.cost}</span>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt && attachedImages.length === 0)}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[13px] transition ${
                  isGenerating
                    ? 'opacity-50 cursor-wait'
                    : prompt || attachedImages.length > 0
                    ? 'hover:opacity-90 active:scale-[0.97]'
                    : 'cursor-not-allowed'
                }`}
                style={
                  isGenerating
                    ? { background: 'var(--accent)', color: 'var(--t-accent-text)' }
                    : prompt || attachedImages.length > 0
                    ? { background: 'var(--accent)', color: 'var(--t-accent-text)', boxShadow: '0 10px 15px -3px rgba(209,254,23,0.2)' }
                    : { background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-faint)' }
                }
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Generate
                    <span className="text-[11px] opacity-60">✦ {selectedModel.cost}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
    </div>
  );
}
