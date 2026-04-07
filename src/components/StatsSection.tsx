import { SpinResult } from "@/pages/Index";

interface StatsSectionProps {
  history: SpinResult[];
}

export default function StatsSection({ history }: StatsSectionProps) {
  const total = history.length;
  const reds = history.filter(h => h.color === "red").length;
  const blacks = history.filter(h => h.color === "black").length;
  const greens = history.filter(h => h.color === "green").length;

  const numCount: Record<number, number> = {};
  history.forEach(h => { numCount[h.number] = (numCount[h.number] || 0) + 1; });
  const hotNumbers = Object.entries(numCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const redPct = total ? Math.round((reds / total) * 100) : 0;
  const blackPct = total ? Math.round((blacks / total) * 100) : 0;
  const greenPct = total ? Math.round((greens / total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-gold/60 font-oswald tracking-widest text-xs uppercase mb-2">Данные сессии</p>
        <h2 className="font-playfair text-4xl font-black text-white">Статистика</h2>
        <div className="ornament mt-3">✦ ✦ ✦</div>
      </div>

      {total === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-20">📊</div>
          <p className="font-oswald text-white/30 tracking-wide">Сыграйте несколько раундов для статистики</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Красных", value: reds, pct: redPct, cls: "border-red-700 bg-red-950/40" },
              { label: "Чёрных", value: blacks, pct: blackPct, cls: "border-white/20 bg-white/5" },
              { label: "Зеро", value: greens, pct: greenPct, cls: "border-green-700 bg-green-950/40" },
            ].map(s => (
              <div key={s.label} className={`stat-card border ${s.cls}`}>
                <div className="font-playfair text-3xl font-black text-white">{s.value}</div>
                <div className="font-oswald text-white/50 text-xs tracking-widest uppercase mt-1">{s.label}</div>
                <div className="font-oswald text-gold text-lg font-semibold">{s.pct}%</div>
              </div>
            ))}
          </div>

          <div className="stat-card border border-gold/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-lg font-bold text-gold">Горячие числа</h3>
              <span className="font-oswald text-white/30 text-xs">Топ-5</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {hotNumbers.map(([num, count]) => (
                <div key={num} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                    <span className="font-playfair font-black text-black text-sm">{num}</span>
                  </div>
                  <span className="font-oswald text-white/40 text-xs">{count}×</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card border border-gold/20 text-center">
            <div className="font-oswald text-white/40 text-xs tracking-widest uppercase mb-1">Всего спинов</div>
            <div className="font-playfair text-6xl font-black text-gold">{total}</div>
          </div>
        </div>
      )}
    </div>
  );
}
