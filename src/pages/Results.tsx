import { Award, Trophy, Star, TrendingUp } from "lucide-react";
import celebratingImg from "@/assets/students-celebrating.jpg";

const toppers = [
  { name: "Ananya Sharma", class: "Class 10 CBSE", score: "98.6%", year: "2024" },
  { name: "Rohit Kumar", class: "Class 12 Science", score: "97.2%", year: "2024" },
  { name: "Priyanka Singh", class: "Class 10 ICSE", score: "96.8%", year: "2024" },
  { name: "Arjun Patel", class: "Class 12 Science", score: "96.4%", year: "2024" },
  { name: "Meera Gupta", class: "Class 10 CBSE", score: "95.8%", year: "2023" },
  { name: "Vikash Yadav", class: "Class 12 Science", score: "95.2%", year: "2023" },
];

const achievements = [
  { icon: Trophy, title: "Best Coaching Institute Award", desc: "Recognized as the best coaching institute in the city for 3 consecutive years." },
  { icon: Star, title: "100% Board Results", desc: "All students cleared board exams with first division for the last 5 years." },
  { icon: TrendingUp, title: "JEE/NEET Selections", desc: "50+ students selected in JEE Mains and NEET in the last 3 years." },
  { icon: Award, title: "Olympiad Winners", desc: "15+ students won state and national level Olympiad medals." },
];

const Results = () => (
  <>
    <section className="bg-hero-gradient py-20">
      <div className="container text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Results & Achievements</h1>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Our students consistently deliver outstanding results, making us proud year after year.</p>
      </div>
    </section>

    {/* Toppers */}
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">Our <span className="text-primary">Toppers</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toppers.map((t, i) => (
            <div key={t.name} className="bg-card rounded-xl border p-6 hover-lift text-center relative overflow-hidden">
              {i < 3 && <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">🏆 Top {i + 1}</div>}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-xl text-primary">{t.name.charAt(0)}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg">{t.name}</h3>
              <p className="text-muted-foreground text-sm">{t.class}</p>
              <p className="text-3xl font-heading font-extrabold text-primary mt-2">{t.score}</p>
              <p className="text-muted-foreground text-xs mt-1">Year: {t.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Success Image */}
    <section className="py-0">
      <div className="container">
        <img src={celebratingImg} alt="Students celebrating exam results at Pal Classes" className="w-full rounded-2xl shadow-lg h-64 md:h-96 object-cover" />
      </div>
    </section>

    {/* Achievements */}
    <section className="py-16 md:py-24 bg-section-gradient">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12">Awards & <span className="text-primary">Recognition</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
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

export default Results;
