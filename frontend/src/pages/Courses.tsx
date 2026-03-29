import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, CheckCircle, FileText, Download, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";

const defaultCourses = [
  {
    level: "Pre-Primary", classes: "Nursery, Jr.KG, Sr.KG", icon: "🧒",
    color: "bg-[hsl(340,60%,92%)] border-[hsl(340,60%,80%)]",
    subjects: ["English", "Hindi", "Mathematics", "Drawing", "Rhymes & Activities"],
    features: ["Play-based learning", "Activity & craft sessions", "Phonics & number recognition", "Motor skill development"],
    duration: "Full Academic Year", method: "Fun, interactive and activity-based learning", batchSize: "15 students per batch",
  },
  {
    level: "Primary", classes: "Class 1-4", icon: "📚",
    color: "bg-[hsl(142,60%,92%)] border-[hsl(142,60%,80%)]",
    subjects: ["Mathematics", "English", "Hindi", "Science", "EVS"],
    features: ["Foundation building approach", "Activity-based learning", "Regular homework & follow-up", "Fun quizzes & competitions"],
    duration: "Full Academic Year", method: "Interactive classroom teaching with worksheets", batchSize: "20 students per batch",
  },
  {
    level: "Secondary", classes: "Class 5-10", icon: "📐",
    color: "bg-[hsl(40,90%,90%)] border-[hsl(40,90%,78%)]",
    subjects: ["Mathematics", "Science", "English", "Hindi", "Social Science"],
    features: ["Board exam preparation", "Weekly tests & mock exams", "Concept strengthening", "Previous year paper solving", "Special doubt sessions"],
    duration: "Full Academic Year + Crash Course", method: "Board-focused teaching with intensive revision", batchSize: "25 students per batch",
  },
  {
    level: "Special Batches", classes: "Class 8, 9 & 10", icon: "🎯",
    color: "bg-[hsl(280,60%,92%)] border-[hsl(280,60%,80%)]",
    subjects: ["Mathematics", "Science", "English", "Social Science"],
    features: ["Intensive board exam prep", "Daily practice & revision", "Mock test series", "Personal performance tracking", "Extra lectures for weak students"],
    duration: "Full Academic Year + Summer Batch", method: "Advanced problem-solving with focused revision and extra support", batchSize: "20 students per batch",
  },
];

const courseColors = [
  "bg-[hsl(340,60%,92%)] border-[hsl(340,60%,80%)]",
  "bg-[hsl(142,60%,92%)] border-[hsl(142,60%,80%)]",
  "bg-[hsl(40,90%,90%)] border-[hsl(40,90%,78%)]",
  "bg-[hsl(280,60%,92%)] border-[hsl(280,60%,80%)]",
  "bg-[hsl(200,60%,92%)] border-[hsl(200,60%,80%)]",
  "bg-[hsl(20,60%,92%)] border-[hsl(20,60%,80%)]",
];

const Courses = () => {
  useScrollAnimation();
  const { getContent, getListItems } = useCmsContent("courses");

  const heroTitle = getContent("hero_title", "Our Courses");
  const heroSubtitle = getContent("hero_subtitle", "Comprehensive programs from Nursery to Class 10, designed to build strong foundations and achieve top results.");

  const cmsCourses = getListItems("course", ["level", "classes", "icon", "subjects", "features", "duration", "method", "batchSize"]);

  const courses: any[] = cmsCourses.length > 0
    ? cmsCourses.map((c, i) => ({
        ...c,
        subjects: c.subjects ? c.subjects.split(",").map(s => s.trim()) : [],
        features: c.features ? c.features.split(",").map(s => s.trim()) : [],
        color: courseColors[i % courseColors.length],
      }))
    : defaultCourses;

  const [notes, setNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [noteSearch, setNoteSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notes`);
      if (res.ok) setNotes(await res.json());
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const classes = ["All", ...new Set(notes.map(n => n.className))];
  const filteredNotes = notes.filter(n => 
    (selectedClass === "All" || n.className === selectedClass) &&
    (n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.className.toLowerCase().includes(noteSearch.toLowerCase()))
  );

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">{heroTitle}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          {courses.map((course, idx) => (
            <div key={idx} className={`bg-card rounded-2xl border overflow-hidden shadow-sm ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''} md:flex gsap-fade-up`}>
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
                      {course.subjects.map((s: string) => (
                        <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Key Features</h3>
                    <ul className="space-y-1.5">
                      {course.features.map((f: string) => (
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
      <section className="py-16 bg-muted/30">
        <div className="container space-y-10">
          <div className="text-center space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-primary" /> Study Notes & PDFs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Access our specialized study materials and previous year notes for all classes.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search notes by title or class..." 
                  className="pl-10"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                {classes.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedClass(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedClass === c ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {loadingNotes ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <div key={note._id} className="group bg-muted/20 border rounded-xl p-5 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {note.className}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 mb-2 truncate">{note.title}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-6">
                      Size: {(note.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <div className="flex gap-2">
                      <a href={`${import.meta.env.VITE_API_BASE_URL}${note.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </a>
                      <a href={`${import.meta.env.VITE_API_BASE_URL}${note.fileUrl}`} download className="flex-1">
                        <Button size="sm" className="w-full gap-2 text-xs">
                          <Download className="w-3.5 h-3.5" /> Download
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No notes found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;
