import Icon from "@/components/ui/icon";

interface NavBarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  muted: boolean;
  onToggleMute: () => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "stats", label: "Статистика" },
  { id: "rules", label: "Правила" },
  { id: "faq", label: "FAQ" },
  { id: "contacts", label: "Контакты" },
];

export default function NavBar({ activeSection, onNavigate, muted, onToggleMute }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎰</span>
          <span className="font-playfair text-gold font-bold text-lg tracking-wide">
            Casino Royale
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-link font-oswald text-sm tracking-wider uppercase px-4 py-2 rounded transition-all ${
                activeSection === item.id
                  ? "text-gold border-b-2 border-gold"
                  : "text-white/70 hover:text-gold"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden flex gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-xs font-oswald px-2 py-1 rounded transition-all ${
                  activeSection === item.id ? "text-gold" : "text-white/50"
                }`}
              >
                {item.label.slice(0, 3)}
              </button>
            ))}
          </div>

          <button
            onClick={onToggleMute}
            title={muted ? "Включить звук" : "Выключить звук"}
            className={`mute-btn ml-2 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              muted
                ? "border-white/20 text-white/30 hover:border-white/40 hover:text-white/50"
                : "border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
            }`}
          >
            <Icon name={muted ? "VolumeX" : "Volume2"} size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
