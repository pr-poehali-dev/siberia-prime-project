import Icon from "@/components/ui/icon";

const CONTACTS = [
  { icon: "Mail", label: "Email", value: "support@casino-royale.ru", href: "mailto:support@casino-royale.ru" },
  { icon: "MessageCircle", label: "Telegram", value: "@casinoroyale_ru", href: "https://t.me/" },
  { icon: "Phone", label: "Телефон", value: "+7 (800) 000-00-00", href: "tel:+78000000000" },
];

export default function ContactsSection() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-gold/60 font-oswald tracking-widest text-xs uppercase mb-2">Свяжитесь с нами</p>
        <h2 className="font-playfair text-4xl font-black text-white">Контакты</h2>
        <div className="ornament mt-3">✦ ✦ ✦</div>
      </div>

      <div className="space-y-4 mb-10">
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="contact-card flex items-center gap-5 group"
          >
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 group-hover:border-gold transition-colors">
              <Icon name={c.icon} size={20} className="text-gold" />
            </div>
            <div>
              <div className="font-oswald text-xs text-white/40 tracking-widest uppercase mb-0.5">{c.label}</div>
              <div className="font-playfair text-white text-lg group-hover:text-gold transition-colors">{c.value}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="border border-gold/20 rounded-2xl p-6 bg-white/5">
        <h3 className="font-playfair text-xl font-bold text-gold mb-4">Написать нам</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white font-oswald text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white font-oswald text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <textarea
            placeholder="Сообщение"
            rows={4}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white font-oswald text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
          />
          <button className="spin-btn w-full">ОТПРАВИТЬ</button>
        </div>
      </div>
    </div>
  );
}
