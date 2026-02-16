import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { UserCheck, Monitor, FileText, BookOpen, HelpCircle, HeartHandshake, Wifi, IndianRupee, CheckCircle } from "lucide-react";

const facilities = [
  {
    icon: UserCheck,
    title: "Well Experienced Faculty",
    desc: "Our teaching staff comprises highly qualified educators with 10–18 years of experience across all subjects. Each faculty member holds advanced degrees (M.Sc., M.A., B.Ed., NET) and undergoes regular training to stay updated with the latest CBSE & SSC board curricula. They employ student-centric teaching methods to ensure every child reaches their full potential.",
    highlights: ["Qualified M.Sc. & B.Ed. teachers", "Average 12+ years experience", "Regular pedagogical training", "Individual attention to every student"],
  },
  {
    icon: Monitor,
    title: "Smart Classroom",
    desc: "Our classrooms are equipped with interactive digital panels, projectors, and audio-visual teaching aids. Smart classrooms make complex topics easy to understand through 3D models, animations, and video lessons. This technology-enhanced environment keeps students engaged and improves retention of difficult concepts in Science, Maths, and other subjects.",
    highlights: ["Interactive digital panels", "3D models & animated lessons", "Audio-visual teaching aids", "Technology-enhanced learning"],
  },
  {
    icon: FileText,
    title: "Comprehensive Study Material",
    desc: "We provide meticulously prepared study material, chapter-wise notes, formula sheets, and practice question banks for every subject. Our materials are designed by experienced educators and aligned with the latest board exam patterns. Students receive printed booklets, worksheets, and access to digital resources — ensuring they have everything needed to excel.",
    highlights: ["Chapter-wise detailed notes", "Formula sheets & quick revision guides", "Practice question banks", "Aligned with latest board patterns"],
  },
  {
    icon: BookOpen,
    title: "Regular Test & Assessment",
    desc: "We conduct weekly unit tests, monthly assessments, and full-length mock board exams throughout the year. Each test is followed by detailed result analysis and parent-teacher discussions. This continuous evaluation system helps identify weak areas early, track progress, and build exam-ready confidence in students well before the final boards.",
    highlights: ["Weekly unit tests", "Monthly comprehensive exams", "Full-length mock board papers", "Detailed performance analysis & reports"],
  },
  {
    icon: HelpCircle,
    title: "Doubt Clearing Sessions",
    desc: "Dedicated doubt-clearing sessions are held after every chapter and before exams. Students can freely ask questions without hesitation in a supportive environment. Our teachers ensure that no student moves ahead with unresolved doubts. One-on-one sessions are also available for students who need extra help with difficult topics.",
    highlights: ["After every chapter completion", "Pre-exam special sessions", "One-on-one support available", "Judgment-free, supportive environment"],
  },
  {
    icon: HeartHandshake,
    title: "Counselling & Guidance",
    desc: "We offer comprehensive career counselling and academic guidance for students from Class 8 onwards. Regular parent-teacher meetings keep families informed about their child's progress. Our counsellors help students choose the right stream after SSC, manage exam stress, develop effective study habits, and set achievable academic goals.",
    highlights: ["Career stream guidance after SSC", "Exam stress management", "Regular parent-teacher meetings", "Study habit & goal-setting workshops"],
  },
  {
    icon: Wifi,
    title: "Online Support",
    desc: "Students stay connected with teachers beyond classroom hours through our online support system. WhatsApp groups, video doubt-solving sessions, and digital assignments ensure learning never stops. During exam season, special online revision classes and live Q&A sessions are conducted to provide maximum support to every student.",
    highlights: ["WhatsApp doubt-solving groups", "Video classes & live Q&A", "Digital assignments & worksheets", "24/7 exam-season support"],
  },
  {
    icon: IndianRupee,
    title: "Economical Fees with Easy EMI",
    desc: "Quality education should be accessible to all. Our fee structure is designed to be highly affordable compared to other coaching institutes. We offer flexible EMI payment plans so that no student misses out on quality coaching due to financial constraints. Scholarships and fee concessions are available for meritorious and economically weaker students.",
    highlights: ["Most affordable in the area", "Flexible monthly EMI plans", "Scholarships for merit students", "Fee concession for economically weaker students"],
  },
];

const Faculty = () => {
  useScrollAnimation();

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Our Facilities</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We provide a world-class learning environment with modern amenities to ensure every student achieves excellence.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-12">
            {facilities.map((item, index) => (
              <div
                key={item.title}
                className={`gsap-fade-up flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center bg-card rounded-2xl border p-6 md:p-10 hover-lift`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold">{item.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Faculty;
