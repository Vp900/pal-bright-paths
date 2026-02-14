import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Award, Star, ChevronLeft, ChevronRight, GraduationCap, Target, Clock, UserCheck } from "lucide-react";
import heroImg from "@/assets/hero-classroom.jpg";

const stats = [
  { icon: Clock, value: 10, suffix: "+", label: "Years Experience" },
  { icon: Users, value: 2000, suffix: "+", label: "Students Taught" },
  { icon: Award, value: 95, suffix: "%", label: "Success Rate" },
  { icon: Star, value: 50, suffix: "+", label: "Expert Faculty" },
];

const highlights = [
  { icon: UserCheck, title: "Experienced Faculty", desc: "Highly qualified teachers with years of expertise in their subjects." },
  { icon: Users, title: "Small Batch Size", desc: "Limited students per batch ensuring individual attention for each child." },
  { icon: Target, title: "Personalized Attention", desc: "Customized learning plans tailored to each student's needs and pace." },
  { icon: BookOpen, title: "Result-Oriented Teaching", desc: "Proven teaching methodology focused on building concepts and scoring high." },
];

const testimonials = [
  { name: "Priya Sharma", class: "Class 10, CBSE", text: "Pal Classes helped me score 96% in my board exams. The teachers are amazing and always available for doubt solving!", rating: 5 },
  { name: "Rahul Kumar", class: "Class 12, Science", text: "The physics and chemistry classes are excellent. I got selected in JEE Mains thanks to the strong foundation built here.", rating: 5 },
  { name: "Anjali Singh", class: "Parent", text: "My daughter's confidence has improved tremendously. The personalized attention at Pal Classes makes all the difference.", rating: 5 },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref}>{count}{suffix}</div>;
}

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Pal Classes classroom with students learning" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-gradient opacity-85" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
              🎓 Admissions Open for 2025-26
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Shaping Bright Futures with{" "}
              <span className="text-accent">Quality Education</span>
            </h1>
            <p className="text-primary-foreground/85 text-lg md:text-xl mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Expert coaching for classes 1-12 across CBSE, ICSE & State Board. Join 2000+ successful students who trust Pal Classes for academic excellence.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/admission">
                <Button variant="hero" size="xl">Book Free Demo</Button>
              </Link>
              <Link to="/admission">
                <Button variant="hero-outline" size="xl">Enroll Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Why Parents Choose <span className="text-primary">Pal Classes</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide a nurturing environment where every student gets the attention they deserve to excel academically.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-6 border hover-lift text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-hero-gradient">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-primary-foreground">
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="font-heading text-4xl md:text-5xl font-extrabold mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-primary-foreground/75 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Our <span className="text-primary">Programs</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive coaching programs designed for students from Class 1 to 12 across all major boards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Primary (1-5)", subjects: "Maths, English, Hindi, Science, EVS", icon: "📚", color: "bg-[hsl(142,60%,92%)]" },
              { title: "Middle (6-8)", subjects: "Maths, Science, English, Hindi, SST", icon: "🔬", color: "bg-[hsl(200,70%,92%)]" },
              { title: "Secondary (9-10)", subjects: "Maths, Science, English, SST", icon: "📐", color: "bg-[hsl(40,90%,90%)]" },
              { title: "Senior Sec. (11-12)", subjects: "Physics, Chemistry, Biology, Maths", icon: "🎯", color: "bg-[hsl(280,60%,92%)]" },
            ].map((course) => (
              <div key={course.title} className="bg-card rounded-xl border overflow-hidden hover-lift group">
                <div className={`${course.color} p-6 text-center`}>
                  <span className="text-4xl">{course.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{course.subjects}</p>
                  <Link to="/courses">
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-primary">Students Say</span></h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border shadow-sm text-center relative">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg text-muted-foreground italic mb-6">"{testimonials[currentTestimonial].text}"</p>
              <p className="font-heading font-semibold">{testimonials[currentTestimonial].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].class}</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentTestimonial((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentTestimonial ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial((p) => (p === testimonials.length - 1 ? 0 : p + 1))}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hero-gradient">
        <div className="container text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Book a free demo class today and experience the Pal Classes difference. Limited seats available!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission">
              <Button variant="hero" size="xl">Book Free Demo</Button>
            </Link>
            <Link to="/contact">
              <Button variant="hero-outline" size="xl">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
