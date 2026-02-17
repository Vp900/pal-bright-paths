import { useState } from "react";
import { X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";
import heroImgFallback from "@/assets/hero-classroom.jpg";
import classroomImgFallback from "@/assets/classroom-interior.jpg";
import studentsImgFallback from "@/assets/students-studying.jpg";
import celebratingImgFallback from "@/assets/students-celebrating.jpg";
import scienceLabImgFallback from "@/assets/science-lab.jpg";
import sportsImgFallback from "@/assets/sports-day.jpg";
import prizeImgFallback from "@/assets/prize-distribution.jpg";
import mathImgFallback from "@/assets/math-class.jpg";
import libraryImgFallback from "@/assets/library.jpg";
import parentImgFallback from "@/assets/parent-meeting.jpg";

const defaultImages = [
  { src: heroImgFallback, alt: "Classroom teaching session", category: "Teaching" },
  { src: classroomImgFallback, alt: "Modern classroom interior", category: "Classrooms" },
  { src: studentsImgFallback, alt: "Students studying together", category: "Activities" },
  { src: celebratingImgFallback, alt: "Students celebrating results", category: "Events" },
  { src: scienceLabImgFallback, alt: "Science lab experiments", category: "Teaching" },
  { src: sportsImgFallback, alt: "Annual sports day", category: "Events" },
  { src: prizeImgFallback, alt: "Prize distribution ceremony", category: "Events" },
  { src: mathImgFallback, alt: "Mathematics classroom session", category: "Teaching" },
  { src: libraryImgFallback, alt: "Library and reading area", category: "Classrooms" },
  { src: parentImgFallback, alt: "Parent-teacher meeting", category: "Activities" },
];

const defaultCategories = ["All", "Classrooms", "Teaching", "Activities", "Events"];

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  useScrollAnimation();
  const { getContent, getListItems, getListImages } = useCmsContent("gallery");

  const heroTitle = getContent("hero_title", "Gallery");
  const heroSubtitle = getContent("hero_subtitle", "A glimpse into life at Pal Classes — classrooms, events, and student activities.");
  const categoriesStr = getContent("categories", "All,Classrooms,Teaching,Activities,Events");
  const categories = categoriesStr.split(",").map(c => c.trim());

  const cmsGalleryItems = getListItems("gallery_item", ["alt", "category"]);
  const cmsGalleryImages = getListImages("gallery_item", "image");

  const hasGalleryData = cmsGalleryItems.length > 0;
  const images = hasGalleryData
    ? cmsGalleryItems.map((item, i) => ({
        src: cmsGalleryImages[i] || "",
        alt: item.alt,
        category: item.category,
      })).filter(img => img.src)
    : defaultImages;

  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">{heroTitle}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
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
