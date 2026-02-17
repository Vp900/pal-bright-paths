import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Award, Star, ChevronLeft, ChevronRight, GraduationCap, Target, Clock, UserCheck, Monitor, FileText, HelpCircle, HeartHandshake, Wifi, IndianRupee } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";
import heroImgFallback from "@/assets/hero-classroom.jpg";

const defaultHighlights = [
  { icon: UserCheck, title: "Experienced Faculty", desc: "Highly qualified teachers with years of expertise in their subjects." },
  { icon: Users, title: "Small Batch Size", desc: "Limited students per batch ensuring individual attention for each child." },
  { icon: Target, title: "Personalized Attention", desc: "Customized learning plans tailored to each student's needs and pace." },
  { icon: BookOpen, title: "Result-Oriented Teaching", desc: "Proven teaching methodology focused on building concepts and scoring high." },
];

const defaultTestimonials = [
  { name: "Priya Sharma", class: "Class 10, CBSE", text: "Pal Classes helped me score 96% in my board exams. The teachers are amazing and always available for doubt solving!", rating: 5 },
  { name: "Rahul Kumar", class: "Class 12, Science", text: "The physics and chemistry classes are excellent. I got selected in JEE Mains thanks to the strong foundation built here.", rating: 5 },
  { name: "Anjali Singh", class: "Parent", text: "My daughter's confidence has improved tremendously. The personalized attention at Pal Classes makes all the difference.", rating: 5 },
];

const defaultStats = [
  { icon: Clock, value: 15, suffix: "+", label: "Years Experience" },
  { icon: Users, value: 2000, suffix: "+", label: "Students Taught" },
  { icon: Award, value: 100, suffix: "%", label: "Success Rate" },
  { icon: Star, value: 50, suffix: "+", label: "Expert Faculty" },
];

const defaultFacilities = [
  { icon: UserCheck, title: "Well Experienced Faculty", desc: "Qualified and experienced teachers dedicated to student success." },
  { icon: Monitor, title: "Smart Classroom", desc: "Interactive panel-based digital classrooms for better learning." },
  { icon: FileText, title: "Study Material", desc: "Comprehensive study material and notes provided to all students." },
  { icon: BookOpen, title: "Regular Test & Assessment", desc: "Weekly tests, mock exams and continuous assessment for progress tracking." },
  { icon: HelpCircle, title: "Doubt Clearing Sessions", desc: "Dedicated sessions for clearing doubts and strengthening concepts." },
  { icon: HeartHandshake, title: "Counselling & Guidance", desc: "Career counselling and academic guidance for students and parents." },
  { icon: Wifi, title: "Online Support", desc: "Online doubt solving and digital study support for students." },
  { icon: IndianRupee, title: "Economical Fees with Easy EMI", desc: "Affordable fee structure with convenient EMI payment options." },
];

const defaultPrograms = [
  { title: "Pre-Primary", subjects: "English, Hindi, Maths, Drawing, Rhymes", icon: "🧒", color: "bg-[hsl(340,60%,92%)]" },
  { title: "Primary (1-4)", subjects: "Maths, English, Hindi, Science, EVS", icon: "📚", color: "bg-[hsl(142,60%,92%)]" },
  { title: "Secondary (5-10)", subjects: "Maths, Science, English, Hindi, SST", icon: "📐", color: "bg-[hsl(40,90%,90%)]" },
  { title: "Special (8,9,10)", subjects: "Maths, Science, English, SST", icon: "🎯", color: "bg-[hsl(280,60%,92%)]" },
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
  useScrollAnimation();
  const { getContent, getImage, getListItems, loading } = useCmsContent("home");

  // CMS data with fallbacks
  const heroImg = getImage("hero_image", heroImgFallback);
  const heroBadge = getContent("hero_badge", "🎓 Admissions Open for 2025-26");
  const heroTitle = getContent("hero_title", "Shaping Bright Futures with");
  const heroHighlight = getContent("hero_highlight", "Quality Education");
  const heroSubtitle = getContent("hero_subtitle", "Expert coaching for Nursery to Class 10 across State Board. Join 2000+ successful students who trust Pal Classes for academic excellence.");
  const heroBtn1Text = getContent("hero_btn1_text", "Book Free Demo");
  const heroBtn1Link = getContent("hero_btn1_link", "/admission");
  const heroBtn2Text = getContent("hero_btn2_text", "Enroll Now");
  const heroBtn2Link = getContent("hero_btn2_link", "/admission");

  const highlightsTitle = getContent("highlights_title", "Why Parents Choose <span>Pal Classes</span>");
  const highlightsSubtitle = getContent("highlights_subtitle", "We provide a nurturing environment where every student gets the attention they deserve to excel academically.");
  
  const cmsHighlights = getListItems("highlight", ["title", "desc", "icon"]);
  const highlights = cmsHighlights.length > 0 ? cmsHighlights : defaultHighlights.map(h => ({ title: h.title, desc: h.desc, icon: "" }));

  const cmsStats = getListItems("stat", ["value", "suffix", "label"]);
  const stats = cmsStats.length > 0 ? cmsStats : defaultStats.map(s => ({ value: String(s.value), suffix: s.suffix, label: s.label }));

  const facilitiesTitle = getContent("facilities_title", "Our <span>Facilities</span>");
  const facilitiesSubtitle = getContent("facilities_subtitle", "We provide the best learning environment with modern amenities for our students.");
  const cmsFacilities = getListItems("facility", ["title", "desc"]);
  const facilities = cmsFacilities.length > 0 ? cmsFacilities : defaultFacilities.map(f => ({ title: f.title, desc: f.desc }));

  const programsTitle = getContent("programs_title", "Our <span>Programs</span>");
  const programsSubtitle = getContent("programs_subtitle", "Comprehensive coaching programs designed for students from Nursery to Class 10.");
  const cmsPrograms = getListItems("program", ["title", "subjects", "icon"]);
  const programs = cmsPrograms.length > 0 ? cmsPrograms : defaultPrograms.map(p => ({ title: p.title, subjects: p.subjects, icon: p.icon }));

  const testimonialsTitle = getContent("testimonials_title", "What Our <span>Students Say</span>");
  const cmsTestimonials = getListItems("testimonial", ["name", "class", "text", "rating"]);
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials.map(t => ({ name: t.name, class: t.class, text: t.text, rating: String(t.rating) }));

  const ctaTitle = getContent("cta_title", "Ready to Start Your Journey?");
  const ctaSubtitle = getContent("cta_subtitle", "Book a free demo class today and experience the Pal Classes difference. Limited seats available!");
  const ctaBtn1Text = getContent("cta_btn1_text", "Book Free Demo");
  const ctaBtn1Link = getContent("cta_btn1_link", "/admission");
  const ctaBtn2Text = getContent("cta_btn2_text", "Contact Us");
  const ctaBtn2Link = getContent("cta_btn2_link", "/contact");

  const highlightIcons = [UserCheck, Users, Target, BookOpen, GraduationCap, Star];
  const facilityIcons = [UserCheck, Monitor, FileText, BookOpen, HelpCircle, HeartHandshake, Wifi, IndianRupee];
  const statIcons = [Clock, Users, Award, Star];
  const programColors = ["bg-[hsl(340,60%,92%)]", "bg-[hsl(142,60%,92%)]", "bg-[hsl(40,90%,90%)]", "bg-[hsl(280,60%,92%)]"];

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
              {heroBadge}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {heroTitle}{" "}
              <span className="text-accent">{heroHighlight}</span>
            </h1>
            <p className="text-primary-foreground/85 text-lg md:text-xl mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to={heroBtn1Link}>
                <Button variant="hero" size="xl">{heroBtn1Text}</Button>
              </Link>
              <Link to={heroBtn2Link}>
                <Button variant="hero-outline" size="xl">{heroBtn2Text}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container">
          <div className="text-center mb-12 gsap-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: highlightsTitle.replace(/<span>/g, '<span class="text-primary">') }} />
            <p className="text-muted-foreground max-w-2xl mx-auto">{highlightsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger">
            {highlights.map((item, i) => {
              const Icon = highlightIcons[i % highlightIcons.length];
              return (
                <div key={i} className="bg-card rounded-xl p-6 border hover-lift text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-hero-gradient">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div key={i} className="text-center text-primary-foreground">
                  <Icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <div className="font-heading text-4xl md:text-5xl font-extrabold mb-1">
                    <AnimatedCounter value={parseInt(stat.value) || 0} suffix={stat.suffix || ""} />
                  </div>
                  <p className="text-primary-foreground/75 text-sm font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12 gsap-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: facilitiesTitle.replace(/<span>/g, '<span class="text-primary">') }} />
            <p className="text-muted-foreground max-w-2xl mx-auto">{facilitiesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger">
            {facilities.map((item, i) => {
              const Icon = facilityIcons[i % facilityIcons.length];
              return (
                <div key={i} className="bg-card rounded-xl p-6 border hover-lift text-center">
                  <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container">
          <div className="text-center mb-12 gsap-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: programsTitle.replace(/<span>/g, '<span class="text-primary">') }} />
            <p className="text-muted-foreground max-w-2xl mx-auto">{programsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gsap-stagger">
            {programs.map((course, i) => (
              <div key={i} className="bg-card rounded-xl border overflow-hidden hover-lift group">
                <div className={`${programColors[i % programColors.length]} p-6 text-center`}>
                  <span className="text-4xl">{course.icon || defaultPrograms[i]?.icon || "📚"}</span>
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
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12 gsap-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: testimonialsTitle.replace(/<span>/g, '<span class="text-primary">') }} />
          </div>
          <div className="max-w-2xl mx-auto gsap-scale-in">
            <div className="bg-card rounded-2xl p-8 border shadow-sm text-center relative">
              <div className="flex justify-center mb-4">
                {[...Array(parseInt(testimonials[currentTestimonial]?.rating) || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg text-muted-foreground italic mb-6">"{testimonials[currentTestimonial]?.text}"</p>
              <p className="font-heading font-semibold">{testimonials[currentTestimonial]?.name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial]?.class}</p>
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{ctaTitle}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{ctaSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={ctaBtn1Link}>
              <Button variant="hero" size="xl">{ctaBtn1Text}</Button>
            </Link>
            <Link to={ctaBtn2Link}>
              <Button variant="hero-outline" size="xl">{ctaBtn2Text}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
