'use client';
import { useState, useRef, useCallback } from 'react';
import ThemedDotGrid from '@/components/ThemedDotGrid';

const models = [
  { id: 'kling-2.6', name: 'Kling 2.6', icon: '🎬', cost: 100, badge: null, color: '#8b5cf6', modes: ['T2V', 'I2V', 'Motion'] },
  { id: 'kling-3.0', name: 'Kling 3.0', icon: '🎬', cost: 180, badge: 'NEW', color: '#6d28d9', modes: ['T2V', 'I2V'] },
  { id: 'veo-3.0', name: 'Veo 3.0', icon: '▶️', cost: 300, badge: null, color: '#4285f4', modes: ['T2V', 'I2V'] },
  { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', icon: '⚡', cost: 480, badge: null, color: '#34a853', modes: ['T2V', 'I2V'] },
  { id: 'veo-3.1', name: 'Veo 3.1 Standard', icon: '▶️', cost: 960, badge: 'PRO', color: '#ea4335', modes: ['T2V', 'I2V'] },
  { id: 'grok-video', name: 'Grok Video', icon: '🅧', cost: 240, badge: null, color: '#1d9bf0', modes: ['T2V'] },
];

const durations = ['5с', '10с'];
const aspects = ['16:9', '9:16', '1:1'];
const qualities = ['720p', '1080p', '4K'];
const modes = ['T2V', 'I2V', 'Motion'];

interface AttachedImage {
  id: string;
  url: string;
  name: string;
}

interface VideoResult {
  prompt: string;
  model: string;
  aspect: string;
  quality: string;
  duration: string;
  mode: string;
  refs: AttachedImage[];
  timestamp: number;
}

export default function VideoPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('16:9');
  const [quality, setQuality] = useState('1080p');
  const [duration, setDuration] = useState('5с');
  const [mode, setMode] = useState('T2V');
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), url: e.target?.result as string, name: file.name },
        ]);
        if (mode === 'T2V') setMode('I2V');
      };
      reader.readAsDataURL(file);
    });
  }, [mode]);

  const removeAttached = (id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGenerate = () => {
    if (!prompt && attachedImages.length === 0) return;
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setResult({
        prompt: prompt || 'Reference-based video generation',
        model: selectedModel.name,
        aspect,
        quality,
        duration,
        mode,
        refs: [...attachedImages],
        timestamp: Date.now(),
      });
      setIsGenerating(false);
      setIsPlaying(true);
    }, 4000);
  };

  const handleCopyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const closeDropdowns = () => setShowModelPicker(false);

  const activeModes = selectedModel.modes;
  const effectiveMode = activeModes.includes(mode) ? mode : activeModes[0];

  const costMultiplier = duration === '10с' ? 2 : 1;
  const qualityMultiplier = quality === '4K' ? 2 : 1;
  const totalCost = selectedModel.cost * costMultiplier * qualityMultiplier;

  return (
    <div className="relative min-h-screen" onClick={closeDropdowns}>
      <ThemedDotGrid />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-header flex items-center justify-between px-8 py-4 shrink-0 sticky top-0 z-20">
          <h1 className="text-[15px] font-semibold tracking-wide uppercase" style={{ color: 'var(--t-text-secondary)' }}>Генерация видео</h1>
          <span className="glass-subtle text-[12px] px-3 py-1.5 rounded-full" style={{ color: 'var(--t-text-muted)' }}>⚡ 3 000</span>
        </header>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Canvas area */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {result && !isGenerating ? (
              <div className="relative group">
                {/* Video placeholder */}
                <div
                  className={`relative rounded-2xl overflow-hidden flex items-center justify-center ${
                    aspect === '16:9' ? 'w-[640px] h-[360px]' :
                    aspect === '9:16' ? 'w-[320px] h-[568px]' :
                    'w-[420px] h-[420px]'
                  }`}
                  style={{ background: 'var(--t-card-solid)', boxShadow: '0 25px 50px -12px var(--t-shadow)', border: '1px solid var(--t-border)' }}
                >
                  {/* Animated gradient to simulate video */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #16213e 100%)',
                    backgroundSize: '400% 400%',
                    animation: isPlaying ? 'gradientShift 4s ease infinite' : 'none',
                  }} />
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 40% 30%, rgba(209,254,23,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(124,92,255,0.08) 0%, transparent 40%)',
                  }} />

                  {/* Play/pause overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition"
                  >
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg>
                    )}
                  </button>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 z-10 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] text-white/60 font-mono">
                    {isPlaying ? '0:02' : '0:00'} / 0:{duration === '5с' ? '05' : '10'}
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{ background: 'var(--t-badge-bg)' }}>
                    <div
                      className="h-full transition-all duration-1000"
                      style={{ width: isPlaying ? '40%' : '0%', background: 'var(--accent)' }}
                    />
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[12px] text-white/70 hover:text-white transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Скачать MP4
                  </button>
                  <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[12px] text-white/70 hover:text-white transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                    Повторить
                  </button>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-5 w-[300px]">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <circle cx="40" cy="40" r="36" fill="none" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${Math.min(progress, 100) * 2.26} 226`}
                      className="transition-all duration-300"
                      style={{ stroke: 'var(--accent)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[14px] font-bold" style={{ color: 'var(--accent)' }}>
                    {Math.min(Math.round(progress), 100)}%
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium" style={{ color: 'var(--t-text-secondary)' }}>Генерация видео...</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--t-text-faint)' }}>{selectedModel.name} • {duration} • {quality}</p>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--t-badge-bg)' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%`, background: 'var(--accent)' }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-3xl border-2 border-dashed flex items-center justify-center transition" style={{ borderColor: 'var(--t-border2)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--t-text-faint)' }}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[15px] transition font-medium" style={{ color: 'var(--t-text-muted)' }}>Загрузите изображение или напишите промпт</p>
                  <p className="text-[12px] mt-1.5" style={{ color: 'var(--t-text-faint)' }}>Text-to-Video, Image-to-Video, Motion Control</p>
                </div>
              </div>
            )}
          </div>

          {/* Right info panel */}
          {result && !isGenerating && (
            <aside className="w-[320px] shrink-0 glass-panel overflow-y-auto">
              <div className="p-5 space-y-5">
                {/* Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--t-text-muted)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Промпт
                    </div>
                    <button onClick={handleCopyPrompt} className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition" style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-muted)' }}>
                      {copied ? '✓ Скопировано' : 'Copy'}
                    </button>
                  </div>

                  {result.refs.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {result.refs.map((ref) => (
                        <div key={ref.id} className="relative">
                          <img src={ref.url} alt={ref.name} className="w-14 h-14 object-cover rounded-xl" style={{ border: '1px solid var(--t-border2)' }} />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#8b5cf6] flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21"/></svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--t-text-secondary)' }}>{result.prompt}</p>
                </div>

                <div className="h-px" style={{ background: 'var(--t-border)' }} />

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--t-text-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    Информация
                  </div>
                  <div className="space-y-0">
                    {[
                      ['Модель', result.model],
                      ['Режим', result.mode],
                      ['Длительность', result.duration],
                      ['Качество', result.quality],
                      ['Соотношение', result.aspect],
                      ['Размер', result.quality === '4K' ? '3840×2160' : result.quality === '1080p' ? '1920×1080' : '1280×720'],
                      ['Референсы', result.refs.length > 0 ? `${result.refs.length} шт.` : 'Нет'],
                      ['Стоимость', `⚡ ${totalCost}`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--t-border)' }}>
                        <span className="text-[12px]" style={{ color: 'var(--t-text-muted)' }}>{label}</span>
                        <span className="text-[12px] font-medium" style={{ color: 'var(--t-text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px" style={{ background: 'var(--t-border)' }} />

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[13px] font-semibold transition shadow-lg" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Скачать MP4
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleGenerate} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition" style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                      Повторить
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition" style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-secondary)' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                      Продлить
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Bottom prompt bar */}
        <div className="shrink-0 glass-bar px-8 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Attached images */}
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
                <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-xl border border-dashed flex items-center justify-center transition" style={{ borderColor: 'var(--t-border2)', color: 'var(--t-text-faint)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            )}

            <div className="flex items-end gap-3">
              {/* Attach */}
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition"
                style={{ background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-muted)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>

              {/* Input */}
              <div className="flex-1 rounded-2xl overflow-hidden glass-input">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Опишите сцену для видео..."
                  rows={1}
                  className="w-full px-4 pt-3 pb-2 bg-transparent text-[14px] outline-none resize-none"
                  style={{ color: 'var(--t-text-primary)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
                  }}
                />

                {/* Controls */}
                <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
                  {/* Model */}
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
                      <div className="glass-dropdown absolute bottom-full left-0 mb-2 w-60 rounded-xl overflow-hidden z-50 p-1.5">
                        {models.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition"
                            style={selectedModel.id === m.id ? { background: 'var(--t-active)' } : {}}
                          >
                            <span className="text-base">{m.icon}</span>
                            <div className="flex-1">
                              <div className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: 'var(--t-text-secondary)' }}>
                                {m.name}
                                {m.badge && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--t-hover)', color: 'var(--accent)' }}>{m.badge}</span>}
                              </div>
                              <div className="text-[9px] mt-0.5" style={{ color: 'var(--t-text-muted)' }}>⚡ {m.cost} • {m.modes.join(', ')}</div>
                            </div>
                            {selectedModel.id === m.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mode */}
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)' }}>
                    {modes.filter((m) => activeModes.includes(m)).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className="px-2 py-1.5 text-[10px] font-medium transition"
                        style={effectiveMode === m ? { background: 'rgba(139,92,246,0.2)', color: '#a78bfa' } : { color: 'var(--t-text-muted)' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)' }}>
                    {durations.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className="px-2.5 py-1.5 text-[10px] font-medium transition"
                        style={duration === d ? { background: 'var(--t-hover)', color: 'var(--accent)' } : { color: 'var(--t-text-muted)' }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Aspect */}
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--t-hover)', border: '1px solid var(--t-border2)' }}>
                    {aspects.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAspect(a)}
                        className="px-2 py-1.5 text-[10px] font-medium transition"
                        style={aspect === a ? { background: 'var(--t-hover)', color: 'var(--accent)' } : { color: 'var(--t-text-muted)' }}
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
                        style={quality === q ? { background: 'var(--t-hover)', color: 'var(--accent)' } : { color: 'var(--t-text-muted)' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] ml-auto" style={{ color: 'var(--t-text-faint)' }}>⚡ {totalCost}</span>
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt && attachedImages.length === 0)}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[13px] transition ${
                  isGenerating
                    ? 'cursor-wait'
                    : prompt || attachedImages.length > 0
                    ? 'shadow-lg active:scale-[0.97]'
                    : 'cursor-not-allowed'
                }`}
                style={
                  isGenerating
                    ? { background: 'var(--accent)', opacity: 0.5, color: 'var(--t-accent-text)' }
                    : prompt || attachedImages.length > 0
                    ? { background: 'var(--accent)', color: 'var(--t-accent-text)' }
                    : { background: 'var(--t-badge-bg)', border: '1px solid var(--t-border2)', color: 'var(--t-text-faint)' }
                }
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Generate
                    <span className="text-[11px] opacity-60">✦ {totalCost}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animation for video placeholder */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
    </div>
  );
}
