import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";
import { UserCheck, Monitor, FileText, BookOpen, HelpCircle, HeartHandshake, Wifi, IndianRupee, CheckCircle, Star, ArrowRight } from "lucide-react";
import classroomImgFallback from "@/assets/classroom-interior.jpg";
import libraryImgFallback from "@/assets/library.jpg";
import scienceLabImgFallback from "@/assets/science-lab.jpg";
import mathClassImgFallback from "@/assets/math-class.jpg";

const defaultFacilities = [
  {
    icon: UserCheck, title: "Well Experienced Faculty",
    desc: "Our teaching staff comprises highly qualified educators with 10–18 years of experience across all subjects. Each faculty member holds advanced degrees (M.Sc., M.A., B.Ed., NET) and undergoes regular training to stay updated with the latest CBSE & SSC board curricula.",
    highlights: ["Qualified M.Sc. & B.Ed. teachers", "Average 12+ years experience", "Regular pedagogical training", "Individual attention to every student"],
    color: "from-[hsl(220,80%,50%)] to-[hsl(220,90%,35%)]", bgLight: "bg-[hsl(220,80%,96%)]", image: classroomImgFallback,
  },
  {
    icon: Monitor, title: "Smart Classroom",
    desc: "Our classrooms are equipped with interactive digital panels, projectors, and audio-visual teaching aids. Smart classrooms make complex topics easy to understand through 3D models, animations, and video lessons.",
    highlights: ["Interactive digital panels", "3D models & animated lessons", "Audio-visual teaching aids", "Technology-enhanced learning"],
    color: "from-[hsl(160,70%,40%)] to-[hsl(160,80%,30%)]", bgLight: "bg-[hsl(160,50%,95%)]", image: mathClassImgFallback,
  },
  {
    icon: FileText, title: "Comprehensive Study Material",
    desc: "Meticulously prepared study material, chapter-wise notes, formula sheets, and practice question banks for every subject. Aligned with the latest board exam patterns for maximum results.",
    highlights: ["Chapter-wise detailed notes", "Formula sheets & revision guides", "Practice question banks", "Aligned with board patterns"],
    color: "from-[hsl(280,60%,50%)] to-[hsl(280,70%,35%)]", bgLight: "bg-[hsl(280,40%,96%)]", image: libraryImgFallback,
  },
  {
    icon: BookOpen, title: "Regular Test & Assessment",
    desc: "Weekly unit tests, monthly assessments, and full-length mock board exams throughout the year. Each test is followed by detailed result analysis and parent-teacher discussions.",
    highlights: ["Weekly unit tests", "Monthly comprehensive exams", "Mock board papers", "Performance analysis & reports"],
    color: "from-[hsl(40,95%,50%)] to-[hsl(30,95%,45%)]", bgLight: "bg-[hsl(40,80%,95%)]", image: scienceLabImgFallback,
  },
  {
    icon: HelpCircle, title: "Doubt Clearing Sessions",
    desc: "Dedicated doubt-clearing sessions after every chapter and before exams. Students can freely ask questions in a supportive environment. One-on-one sessions available for extra help.",
    highlights: ["After every chapter completion", "Pre-exam special sessions", "One-on-one support available", "Supportive environment"],
    color: "from-[hsl(350,70%,50%)] to-[hsl(350,80%,40%)]", bgLight: "bg-[hsl(350,50%,96%)]", image: classroomImgFallback,
  },
  {
    icon: HeartHandshake, title: "Counselling & Guidance",
    desc: "Comprehensive career counselling and academic guidance from Class 8 onwards. Regular parent-teacher meetings, stress management, and study habit workshops to help students excel.",
    highlights: ["Career stream guidance", "Exam stress management", "Parent-teacher meetings", "Goal-setting workshops"],
    color: "from-[hsl(200,70%,50%)] to-[hsl(200,80%,35%)]", bgLight: "bg-[hsl(200,50%,95%)]", image: mathClassImgFallback,
  },
  {
    icon: Wifi, title: "Online Support",
    desc: "Stay connected with teachers beyond classroom hours through WhatsApp groups, video doubt-solving sessions, and digital assignments. Special online revision classes during exam season.",
    highlights: ["WhatsApp doubt-solving groups", "Video classes & live Q&A", "Digital assignments", "24/7 exam-season support"],
    color: "from-[hsl(170,60%,45%)] to-[hsl(170,70%,30%)]", bgLight: "bg-[hsl(170,40%,95%)]", image: libraryImgFallback,
  },
  {
    icon: IndianRupee, title: "Economical Fees with Easy EMI",
    desc: "Highly affordable fee structure with flexible EMI payment plans. Scholarships and fee concessions available for meritorious and economically weaker students. Quality education for all.",
    highlights: ["Most affordable in the area", "Flexible monthly EMI plans", "Scholarships for merit students", "Fee concession available"],
    color: "from-[hsl(130,60%,40%)] to-[hsl(130,70%,30%)]", bgLight: "bg-[hsl(130,40%,95%)]", image: scienceLabImgFallback,
  },
];

const defaultStats = [
  { value: "8+", label: "Key Facilities" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Success Rate" },
  { value: "500+", label: "Happy Students" },
];

const facilityIcons = [UserCheck, Monitor, FileText, BookOpen, HelpCircle, HeartHandshake, Wifi, IndianRupee];
const facilityColors = [
  { color: "from-[hsl(220,80%,50%)] to-[hsl(220,90%,35%)]", bgLight: "bg-[hsl(220,80%,96%)]" },
  { color: "from-[hsl(160,70%,40%)] to-[hsl(160,80%,30%)]", bgLight: "bg-[hsl(160,50%,95%)]" },
  { color: "from-[hsl(280,60%,50%)] to-[hsl(280,70%,35%)]", bgLight: "bg-[hsl(280,40%,96%)]" },
  { color: "from-[hsl(40,95%,50%)] to-[hsl(30,95%,45%)]", bgLight: "bg-[hsl(40,80%,95%)]" },
  { color: "from-[hsl(350,70%,50%)] to-[hsl(350,80%,40%)]", bgLight: "bg-[hsl(350,50%,96%)]" },
  { color: "from-[hsl(200,70%,50%)] to-[hsl(200,80%,35%)]", bgLight: "bg-[hsl(200,50%,95%)]" },
  { color: "from-[hsl(170,60%,45%)] to-[hsl(170,70%,30%)]", bgLight: "bg-[hsl(170,40%,95%)]" },
  { color: "from-[hsl(130,60%,40%)] to-[hsl(130,70%,30%)]", bgLight: "bg-[hsl(130,40%,95%)]" },
];
const facilityImageFallbacks = [classroomImgFallback, mathClassImgFallback, libraryImgFallback, scienceLabImgFallback, classroomImgFallback, mathClassImgFallback, libraryImgFallback, scienceLabImgFallback];

const Faculty = () => {
  useScrollAnimation();
  const { getContent, getListItems, getListImages } = useCmsContent("facilities");

  const heroBadge = getContent("hero_badge", "✨ World-Class Learning Environment");
  const heroTitle = getContent("hero_title", "Our Facilities");
  const heroSubtitle = getContent("hero_subtitle", "Everything your child needs to excel — from smart classrooms and experienced faculty to affordable fees and 24/7 online support.");

  const cmsStats = getListItems("stat", ["value", "label"]);
  const stats = cmsStats.length > 0 ? cmsStats : defaultStats;

  const cmsFacilities = getListItems("facility", ["title", "desc", "highlights"]);
  const cmsFacilityImages = getListImages("facility", "image");
  const hasFacilityData = cmsFacilities.length > 0;

  const facilities = hasFacilityData
    ? cmsFacilities.map((f, i) => ({
        ...f,
        highlights: f.highlights ? f.highlights.split(",").map((h: string) => h.trim()) : [],
        image: cmsFacilityImages[i] || facilityImageFallbacks[i % facilityImageFallbacks.length],
        icon: facilityIcons[i % facilityIcons.length],
        ...facilityColors[i % facilityColors.length],
      }))
    : defaultFacilities;

  const ctaTitle = getContent("cta_title", "Ready to Experience the Best?");
  const ctaSubtitle = getContent("cta_subtitle", "Join Pal Classes today and give your child the advantage of world-class facilities at affordable fees.");
  const ctaBtnText = getContent("cta_btn_text", "Enroll Now");
  const ctaBtnLink = getContent("cta_btn_link", "/admission");

  return (
    <>
      <section className="bg-hero-gradient py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="container text-center relative z-10">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 gsap-fade-up">{heroBadge}</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-5 gsap-fade-up">{heroTitle}</h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto gsap-fade-up">{heroSubtitle}</p>
        </div>
      </section>

      <section className="relative z-10 -mt-8">
        <div className="container">
          <div className="bg-card rounded-2xl border shadow-xl p-6 md:p-8 gsap-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat: any, i: number) => (
                <div key={i} className="group">
                  <p className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                  <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container space-y-16 md:space-y-24">
          {facilities.map((item: any, index: number) => {
            const Icon = item.icon || facilityIcons[index % facilityIcons.length];
            const colorStr = item.color || facilityColors[index % facilityColors.length].color;
            const bgLightStr = item.bgLight || facilityColors[index % facilityColors.length].bgLight;

            return (
              <div key={index} className={`gsap-fade-up flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-stretch`}>
                <div className="lg:w-5/12 relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorStr} rounded-2xl transform ${index % 2 === 0 ? "rotate-2" : "-rotate-2"} scale-[1.02] opacity-80 group-hover:rotate-0 transition-transform duration-500`} />
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${colorStr} opacity-30`} />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-7/12 flex flex-col justify-center">
                  <div className={`inline-flex items-center gap-2 ${bgLightStr} rounded-full px-4 py-1.5 w-fit mb-4`}>
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{item.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">{item.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(item.highlights || []).map((point: string) => (
                      <div key={point} className="flex items-start gap-3 bg-card border rounded-xl p-3 hover-lift">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        </div>
        <div className="container text-center relative z-10 gsap-fade-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{ctaTitle}</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">{ctaSubtitle}</p>
          <a href={ctaBtnLink} className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
            {ctaBtnText} <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
};

export default Faculty;
