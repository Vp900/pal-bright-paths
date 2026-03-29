import { useState, useEffect } from "react";
import { X, Play, Video, Film, Search, Filter } from "lucide-react";
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
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoFilter, setVideoFilter] = useState("All");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/videos`);
      if (res.ok) setVideos(await res.json());
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const videoCategories = ["All", ...new Set(videos.map(v => v.category))];
  const filteredVideos = videoFilter === "All" 
    ? videos 
    : videos.filter(v => v.category === videoFilter);

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
      <section className="pb-24">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-3">
              <Film className="w-8 h-8 text-primary" /> Video Gallery
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Watch our classroom sessions, event highlights, and student activities in action.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {videoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setVideoFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${videoFilter === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingVideos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="aspect-video rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div key={video._id} className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                    <Video className="w-12 h-12 text-white/20" />
                    <button 
                      onClick={() => setSelectedVideo(`${import.meta.env.VITE_API_BASE_URL}${video.videoUrl}`)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </div>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate flex-1">{video.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0">
                        {video.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Uploaded on {new Date(video.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No videos found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-primary transition-colors" onClick={() => setSelectedVideo(null)}>
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <video 
              src={selectedVideo} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
