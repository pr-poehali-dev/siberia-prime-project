import { SpinResult } from "@/pages/Index";

interface SpinHistoryProps {
  history: SpinResult[];
}

const COLOR_LABELS = {
  red: "Красное",
  black: "Чёрное",
  green: "Зеро",
};

const COLOR_BG = {
  red: "bg-red-800",
  black: "bg-neutral-900 border border-white/10",
  green: "bg-green-800",
};

const COLOR_BADGE = {
  red: "text-red-300",
  black: "text-white/50",
  green: "text-green-300",
};

export default function SpinHistory({ history }: SpinHistoryProps) {
  return (
    <div className="history-panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-xl font-bold text-gold">История спинов</h2>
        {history.length > 0 && (
          <span className="font-oswald text-xs text-white/40 tracking-widest">
            {history.length} спинов
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-30">🎡</div>
          <p className="font-oswald text-white/30 text-sm tracking-wide">
            История пуста
          </p>
          <p className="font-oswald text-white/20 text-xs mt-1">
            Крутите колесо, чтобы начать
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
          {history.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                i === 0 ? "ring-1 ring-gold/40 animate-fade-in" : ""
              } ${COLOR_BG[item.color]}`}
            >
              <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center flex-shrink-0">
                <span className="font-playfair font-black text-white text-base">
                  {item.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-oswald text-xs tracking-widest uppercase ${COLOR_BADGE[item.color]}`}>
                  {COLOR_LABELS[item.color]}
                </div>
                <div className="font-oswald text-white/30 text-xs">
                  {item.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
              </div>
              {i === 0 && (
                <div className="flex-shrink-0">
                  <span className="text-gold text-xs font-oswald tracking-wider">НОВЫЙ</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
