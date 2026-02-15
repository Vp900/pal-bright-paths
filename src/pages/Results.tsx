import { Award, Trophy, Star, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import celebratingImg from "@/assets/students-celebrating.jpg";
import topperSuhela from "@/assets/topper-suhela.jpg";

import topperAlmira from "@/assets/topper-almira.jpg";
import topperPooja from "@/assets/topper-pooja.jpg";
import topperPrashant from "@/assets/topper-prashant.jpg";
import topperFareen from "@/assets/topper-fareen.jpg";
import topperNirjala from "@/assets/topper-nirjala.jpg";
import topperSimran from "@/assets/topper-simran.jpg";
import topperFarheen from "@/assets/topper-farheen.jpg";

const toppers = [
  { name: "Suhela Solkar", class: "SSC", score: "91%", year: "2025", image: topperSuhela },
  { name: "Pooja Prajapati", class: "SSC", score: "90%", year: "2025", image: topperPooja },
  { name: "Almira Karjikar", class: "SSC", score: "87%", year: "2025", image: topperAlmira },
  { name: "Prashant Sahani", class: "SSC", score: "86%", year: "2025", image: topperPrashant },
  { name: "Fariz Sakharkar", class: "SSC", score: "82%", year: "2025", image: null },
  { name: "Fareen Karjikar", class: "SSC", score: "80%", year: "2025", image: topperFareen },
  { name: "Nirjala Poyrekar", class: "SSC", score: "77%", year: "2025", image: topperNirjala },
  { name: "Simran Logde", class: "SSC", score: "76%", year: "2025", image: topperSimran },
  { name: "Farheen Shah", class: "SSC", score: "76%", year: "2025", image: topperFarheen },
  { name: "Atif Shaikh", class: "SSC", score: "76%", year: "2025", image: null },
];

const achievements = [
  { icon: Trophy, title: "Best Coaching Institute Award", desc: "Recognized as the best coaching institute in the city for 3 consecutive years." },
  { icon: Star, title: "100% Board Results", desc: "All students cleared board exams with first division for the last 5 years." },
  { icon: TrendingUp, title: "SSC Board Toppers", desc: "Multiple students scoring 90%+ in SSC board exams every year." },
  { icon: Award, title: "Olympiad Winners", desc: "15+ students won state and national level Olympiad medals." },
];

const Results = () => {
  useScrollAnimation();

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Results & Achievements</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Our students consistently deliver outstanding results, making us proud year after year.</p>
        </div>
      </section>

      {/* SSC Toppers */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12 gsap-fade-up">SSC <span className="text-primary">Toppers 2025</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 gsap-stagger">
            {toppers.map((t, i) => (
              <div key={t.name} className="bg-card rounded-xl border p-6 hover-lift text-center relative overflow-hidden">
                {i < 3 && <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">🏆 Top {i + 1}</div>}
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-primary/20">
                    <span className="font-heading font-bold text-2xl text-primary">{t.name.charAt(0)}</span>
                  </div>
                )}
                <h3 className="font-heading font-semibold text-base">{t.name}</h3>
                <p className="text-muted-foreground text-sm">{t.class}</p>
                <p className="text-3xl font-heading font-extrabold text-primary mt-2">{t.score}</p>
                <p className="text-muted-foreground text-xs mt-1">Year: {t.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Image */}
      <section className="py-0 gsap-scale-in">
        <div className="container">
          <img src={celebratingImg} alt="Students celebrating exam results at Pal Classes" className="w-full rounded-2xl shadow-lg h-64 md:h-96 object-cover" />
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12 gsap-fade-up">Awards & <span className="text-primary">Recognition</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto gsap-stagger">
            {achievements.map((a) => (
              <div key={a.title} className="bg-card rounded-xl border p-6 flex gap-4 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <a.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{a.title}</h3>
                  <p className="text-muted-foreground text-sm">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Results;
