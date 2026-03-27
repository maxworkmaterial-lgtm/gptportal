interface ModelCardProps {
  name: string;
  icon: string;
  color: string;
  badge?: string;
  isNew?: boolean;
}

export default function ModelCard({ name, icon, color, badge, isNew }: ModelCardProps) {
  return (
    <button className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer"
      style={{ }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--t-hover)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div
        className="relative w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-2xl shadow-lg"
        style={{ background: color }}
      >
        <span>{icon}</span>
        {isNew && (
          <span className="absolute -top-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: 'var(--t-accent-text)' }}>
            NEW
          </span>
        )}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[11px] text-center leading-tight max-w-[80px] transition" style={{ color: 'var(--t-text-secondary)' }}>
        {name}
      </span>
    </button>
  );
}
