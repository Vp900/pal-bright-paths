import { useState } from "react";
import { X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImg from "@/assets/hero-classroom.jpg";
import classroomImg from "@/assets/classroom-interior.jpg";
import studentsImg from "@/assets/students-studying.jpg";
import celebratingImg from "@/assets/students-celebrating.jpg";
import scienceLabImg from "@/assets/science-lab.jpg";
import sportsImg from "@/assets/sports-day.jpg";
import prizeImg from "@/assets/prize-distribution.jpg";
import mathImg from "@/assets/math-class.jpg";
import libraryImg from "@/assets/library.jpg";
import parentImg from "@/assets/parent-meeting.jpg";

const images = [
  { src: heroImg, alt: "Classroom teaching session", category: "Teaching" },
  { src: classroomImg, alt: "Modern classroom interior", category: "Classrooms" },
  { src: studentsImg, alt: "Students studying together", category: "Activities" },
  { src: celebratingImg, alt: "Students celebrating results", category: "Events" },
  { src: scienceLabImg, alt: "Science lab experiments", category: "Teaching" },
  { src: sportsImg, alt: "Annual sports day", category: "Events" },
  { src: prizeImg, alt: "Prize distribution ceremony", category: "Events" },
  { src: mathImg, alt: "Mathematics classroom session", category: "Teaching" },
  { src: libraryImg, alt: "Library and reading area", category: "Classrooms" },
  { src: parentImg, alt: "Parent-teacher meeting", category: "Activities" },
  { src: heroImg, alt: "Interactive learning session", category: "Teaching" },
  { src: classroomImg, alt: "Smart classroom setup", category: "Classrooms" },
];

const categories = ["All", "Classrooms", "Teaching", "Activities", "Events"];

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  useScrollAnimation();

  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Gallery</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">A glimpse into life at Pal Classes — classrooms, events, and student activities.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3 mb-10 gsap-fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gsap-stagger">
            {filtered.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(img.src)}
                className="rounded-xl overflow-hidden aspect-[4/3] group relative"
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-end p-4">
                  <span className="text-primary-foreground font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">{img.alt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <button className="absolute top-6 right-6 text-primary-foreground" onClick={() => setSelectedImg(null)}>
            <X className="w-8 h-8" />
          </button>
          <img src={selectedImg} alt="Gallery preview" className="max-w-full max-h-[85vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default Gallery;
