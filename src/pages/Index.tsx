import { useState, useRef, useCallback } from "react";
import RouletteWheel from "@/components/RouletteWheel";
import SpinHistory from "@/components/SpinHistory";
import NavBar from "@/components/NavBar";
import FAQSection from "@/components/FAQSection";
import StatsSection from "@/components/StatsSection";
import RulesSection from "@/components/RulesSection";
import ContactsSection from "@/components/ContactsSection";

export interface SpinResult {
  id: number;
  number: number;
  color: "red" | "black" | "green";
  timestamp: Date;
}

const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

export function getColor(n: number): "red" | "black" | "green" {
  if (n === 0) return "green";
  return RED_NUMBERS.includes(n) ? "red" : "black";
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [spinning, setSpinning] = useState(false);
  const spinIdRef = useRef(0);

  const handleSpin = useCallback((number: number) => {
    spinIdRef.current += 1;
    const result: SpinResult = {
      id: spinIdRef.current,
      number,
      color: getColor(number),
      timestamp: new Date(),
    };
    setHistory(prev => [result, ...prev].slice(0, 100));
  }, []);

  return (
    <div className="min-h-screen casino-bg">
      <NavBar activeSection={activeSection} onNavigate={setActiveSection} />

      {activeSection === "home" && (
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="text-center mb-10 animate-fade-in">
              <p className="text-gold-light font-oswald tracking-[0.4em] text-sm uppercase mb-3 opacity-80">
                Классическое казино
              </p>
              <h1 className="font-playfair text-5xl md:text-7xl font-black text-white leading-tight">
                Европейская
                <span className="text-gradient block">Рулетка</span>
              </h1>
              <div className="ornament my-4">✦ ✦ ✦</div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
              <div className="flex-1 flex justify-center">
                <RouletteWheel onSpin={handleSpin} spinning={spinning} setSpinning={setSpinning} />
              </div>
              <div className="w-full xl:w-80">
                <SpinHistory history={history} />
              </div>
            </div>
          </div>
        </main>
      )}

      {activeSection === "stats" && (
        <div className="pt-20">
          <StatsSection history={history} />
        </div>
      )}

      {activeSection === "faq" && (
        <div className="pt-20">
          <FAQSection />
        </div>
      )}

      {activeSection === "rules" && (
        <div className="pt-20">
          <RulesSection />
        </div>
      )}

      {activeSection === "contacts" && (
        <div className="pt-20">
          <ContactsSection />
        </div>
      )}

      <footer className="border-t border-gold/20 mt-16 py-8 text-center">
        <p className="text-gold-light/40 font-oswald text-xs tracking-widest uppercase">
          © 2024 Классическая рулетка · Только для развлечения
        </p>
      </footer>
    </div>
  );
}
