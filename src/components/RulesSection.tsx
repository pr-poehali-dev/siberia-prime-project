const RULES = [
  {
    num: "01",
    title: "Числа на колесе",
    text: "Европейское колесо рулетки содержит числа от 0 до 36. Число 0 обозначено зелёным цветом, остальные 36 чисел распределены между красным и чёрным.",
  },
  {
    num: "02",
    title: "Красные числа",
    text: "К красным относятся: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36.",
  },
  {
    num: "03",
    title: "Чёрные числа",
    text: "К чёрным относятся: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35.",
  },
  {
    num: "04",
    title: "Зеро",
    text: "Число 0 — зеро. Обозначается зелёным цветом. Не относится ни к красным, ни к чёрным числам.",
  },
  {
    num: "05",
    title: "Порядок секторов",
    text: "Числа на колесе расположены в особом порядке, обеспечивающем равномерное чередование цветов и максимальный баланс между соседними секторами.",
  },
  {
    num: "06",
    title: "Справедливость",
    text: "Каждый спин — независимое случайное событие. Прошлые результаты никак не влияют на будущие. Вероятность выпадения любого числа всегда 1/37.",
  },
];

export default function RulesSection() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-gold/60 font-oswald tracking-widest text-xs uppercase mb-2">Как играть</p>
        <h2 className="font-playfair text-4xl font-black text-white">Правила</h2>
        <div className="ornament mt-3">✦ ✦ ✦</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {RULES.map((rule) => (
          <div key={rule.num} className="rule-card">
            <div className="font-playfair text-4xl font-black text-gold/20 mb-2">{rule.num}</div>
            <h3 className="font-playfair text-lg font-bold text-white mb-2">{rule.title}</h3>
            <p className="font-oswald text-white/50 text-sm leading-relaxed">{rule.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
