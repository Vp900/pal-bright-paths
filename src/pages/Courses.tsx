import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const courses = [
  {
    level: "Pre-Primary",
    classes: "Nursery, Jr.KG, Sr.KG",
    icon: "🧒",
    color: "bg-[hsl(340,60%,92%)] border-[hsl(340,60%,80%)]",
    subjects: ["English", "Hindi", "Mathematics", "Drawing", "Rhymes & Activities"],
    features: ["Play-based learning", "Activity & craft sessions", "Phonics & number recognition", "Motor skill development"],
    duration: "Full Academic Year",
    method: "Fun, interactive and activity-based learning",
    batchSize: "15 students per batch",
  },
  {
    level: "Primary",
    classes: "Class 1-4",
    icon: "📚",
    color: "bg-[hsl(142,60%,92%)] border-[hsl(142,60%,80%)]",
    subjects: ["Mathematics", "English", "Hindi", "Science", "EVS"],
    features: ["Foundation building approach", "Activity-based learning", "Regular homework & follow-up", "Fun quizzes & competitions"],
    duration: "Full Academic Year",
    method: "Interactive classroom teaching with worksheets",
    batchSize: "20 students per batch",
  },
  {
    level: "Secondary",
    classes: "Class 5-10",
    icon: "📐",
    color: "bg-[hsl(40,90%,90%)] border-[hsl(40,90%,78%)]",
    subjects: ["Mathematics", "Science", "English", "Hindi", "Social Science"],
    features: ["Board exam preparation", "Weekly tests & mock exams", "Concept strengthening", "Previous year paper solving", "Special doubt sessions"],
    duration: "Full Academic Year + Crash Course",
    method: "Board-focused teaching with intensive revision",
    batchSize: "25 students per batch",
  },
  {
    level: "Special Batches",
    classes: "Class 8, 9 & 10",
    icon: "🎯",
    color: "bg-[hsl(280,60%,92%)] border-[hsl(280,60%,80%)]",
    subjects: ["Mathematics", "Science", "English", "Social Science"],
    features: ["Intensive board exam prep", "Daily practice & revision", "Mock test series", "Personal performance tracking", "Extra lectures for weak students"],
    duration: "Full Academic Year + Summer Batch",
    method: "Advanced problem-solving with focused revision and extra support",
    batchSize: "20 students per batch",
  },
];

const Courses = () => {
  useScrollAnimation();

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Our Courses</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Comprehensive programs from Nursery to Class 10, designed to build strong foundations and achieve top results.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          {courses.map((course, idx) => (
            <div key={course.level} className={`bg-card rounded-2xl border overflow-hidden shadow-sm ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''} md:flex gsap-fade-up`}>
              <div className={`${course.color} p-8 md:w-80 flex flex-col items-center justify-center shrink-0`}>
                <span className="text-6xl mb-4">{course.icon}</span>
                <h2 className="font-heading text-2xl font-bold text-center">{course.level}</h2>
                <p className="text-muted-foreground font-medium">{course.classes}</p>
              </div>
              <div className="p-6 md:p-8 flex-1">
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-heading font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.subjects.map((s) => (
                        <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Key Features</h3>
                    <ul className="space-y-1.5">
                      {course.features.map((f) => (
                        <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.batchSize}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6"><strong>Teaching Method:</strong> {course.method}</p>
                <Link to="/admission">
                  <Button>Enroll Now</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Courses;
