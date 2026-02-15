import { CheckCircle, Target, Eye } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import classroomImg from "@/assets/classroom-interior.jpg";
import studentsImg from "@/assets/students-studying.jpg";
import founderImg from "@/assets/founder.png";

const About = () => {
  useScrollAnimation();

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">About Pal Classes</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">A trusted name in quality education, nurturing young minds since 2014.</p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="gsap-slide-left">
              <img src={classroomImg} alt="Modern classroom at Pal Classes" className="rounded-2xl shadow-lg w-full h-80 object-cover" />
            </div>
            <div className="gsap-slide-right">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Eye className="w-6 h-6 text-primary" /></div>
                <h2 className="font-heading text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                To become the most trusted coaching institute that empowers students with knowledge, confidence, and values to excel in academics and beyond. We envision a future where every student from our institute becomes a responsible and successful individual.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center"><Target className="w-6 h-6 text-accent" /></div>
                <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To provide affordable, high-quality education with personalized attention, innovative teaching methods, and a supportive learning environment that helps every student realize their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-16 bg-section-gradient">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-10 gsap-fade-up">Founder's Message</h2>
          <div className="max-w-4xl mx-auto gsap-fade-up">
            <div className="bg-card rounded-2xl p-8 md:p-10 border shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <img src={founderImg} alt="G.M. Pal - Founder of Pal Classes" className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover shadow-md shrink-0" />
              <div>
                <p className="text-muted-foreground text-lg leading-relaxed italic mb-6">
                  "When I started Pal Classes over a decade ago, I had a simple belief — every child deserves quality education regardless of their background. Today, seeing thousands of students achieve their dreams fills me with immense pride. Our commitment to academic excellence, combined with values-based education, sets us apart. I invite you to join the Pal Classes family and experience the difference that dedicated teaching can make."
                </p>
                <p className="font-heading font-semibold text-lg">Mr. Rajesh Pal</p>
                <p className="text-muted-foreground text-sm">Founder & Director, Pal Classes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="gsap-slide-left">
              <h2 className="font-heading text-3xl font-bold mb-6">Our Teaching <span className="text-primary">Methodology</span></h2>
              <div className="space-y-4">
                {[
                  "Concept-based learning with real-world examples",
                  "Regular tests and performance tracking",
                  "Doubt clearing sessions after every class",
                  "Study material prepared by expert teachers",
                  "Parent-teacher meetings for progress updates",
                  "Mock exams simulating board exam patterns",
                  "Individual mentoring for weak students",
                  "Digital tools and interactive learning aids",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="gsap-slide-right">
              <img src={studentsImg} alt="Students studying together at Pal Classes" className="rounded-2xl shadow-lg w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-hero-gradient">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground text-center mb-12 gsap-fade-up">Why Choose Pal Classes?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-stagger">
            {[
              { title: "15+ Years of Excellence", desc: "A proven track record of producing toppers and successful students." },
              { title: "Expert Faculty Team", desc: "Teachers with 10-20 years of experience from top institutions." },
              { title: "Small Batch Sizes", desc: "Maximum 25 students per batch for focused learning." },
              { title: "Affordable Fee Structure", desc: "Quality education accessible to every family, with EMI options." },
              { title: "Regular Assessments", desc: "Weekly tests and monthly exams to track progress continuously." },
              { title: "Safe Learning Environment", desc: "CCTV-monitored, clean and comfortable classrooms." },
            ].map((item) => (
              <div key={item.title} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
                <h3 className="font-heading font-semibold text-lg text-primary-foreground mb-2">{item.title}</h3>
                <p className="text-primary-foreground/75 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
