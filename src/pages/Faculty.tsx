import teacher1 from "@/assets/teacher-1.jpg";
import teacher2 from "@/assets/teacher-2.jpg";
import teacher3 from "@/assets/teacher-3.jpg";
import teacher4 from "@/assets/teacher-4.jpg";

const faculty = [
  { name: "Mr. Amit Verma", subject: "Mathematics", qualification: "M.Sc. Mathematics, B.Ed.", experience: "15 Years", image: teacher1 },
  { name: "Ms. Sunita Devi", subject: "Science & Biology", qualification: "M.Sc. Zoology, B.Ed.", experience: "12 Years", image: teacher2 },
  { name: "Mr. Rajesh Pal", subject: "Physics", qualification: "M.Sc. Physics, Ph.D. (Pursuing)", experience: "18 Years", image: teacher3 },
  { name: "Ms. Neha Gupta", subject: "Chemistry", qualification: "M.Sc. Chemistry, NET Qualified", experience: "10 Years", image: teacher4 },
  { name: "Mr. Sandeep Tiwari", subject: "English", qualification: "M.A. English Literature, B.Ed.", experience: "14 Years", image: teacher1 },
  { name: "Ms. Kavita Singh", subject: "Hindi", qualification: "M.A. Hindi, B.Ed.", experience: "11 Years", image: teacher2 },
];

const Faculty = () => (
  <>
    <section className="bg-hero-gradient py-20">
      <div className="container text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Our Faculty</h1>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Meet our team of dedicated and experienced educators who make learning a joyful experience.</p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((teacher) => (
            <div key={teacher.name} className="bg-card rounded-2xl border overflow-hidden hover-lift group">
              <div className="h-64 overflow-hidden">
                <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-heading font-semibold text-lg">{teacher.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{teacher.subject}</p>
                <p className="text-muted-foreground text-sm">{teacher.qualification}</p>
                <span className="inline-block mt-3 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">{teacher.experience} Experience</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Faculty;
