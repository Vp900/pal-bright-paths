import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, UserPlus, ClipboardList, CreditCard } from "lucide-react";

const steps = [
  { icon: FileText, title: "Fill Enquiry Form", desc: "Submit the online enquiry form or visit our center." },
  { icon: ClipboardList, title: "Attend Demo Class", desc: "Experience our teaching style with a free demo class." },
  { icon: UserPlus, title: "Complete Registration", desc: "Fill the admission form and submit required documents." },
  { icon: CreditCard, title: "Pay Fees & Start", desc: "Complete fee payment and begin your learning journey." },
];

const fees = [
  { level: "Primary (1-5)", monthly: "₹1,500", yearly: "₹15,000" },
  { level: "Middle (6-8)", monthly: "₹2,000", yearly: "₹20,000" },
  { level: "Secondary (9-10)", monthly: "₹3,000", yearly: "₹30,000" },
  { level: "Senior Sec. (11-12)", monthly: "₹4,000", yearly: "₹40,000" },
];

const Admission = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", class: "", message: "" });
  const [demoData, setDemoData] = useState({ name: "", phone: "", class: "", preferredDate: "" });
  const [submitted, setSubmitted] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">Admission & Enquiry</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Join Pal Classes today. Fill the form below or book a free demo class to experience our teaching.</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Admission <span className="text-primary">Process</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-heading font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="py-16 bg-section-gradient">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Enquiry Form */}
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <h3 className="font-heading text-xl font-bold mb-6">Enquiry Form</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-heading font-semibold text-lg">Thank you for your enquiry!</p>
                  <p className="text-muted-foreground text-sm mt-2">We will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-4">
                  <input type="text" placeholder="Student Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <select required value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Class</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                  </select>
                  <textarea placeholder="Your Message (Optional)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring h-24 resize-none" />
                  <Button type="submit" className="w-full" size="lg">Submit Enquiry</Button>
                </form>
              )}
            </div>

            {/* Demo Booking */}
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <h3 className="font-heading text-xl font-bold mb-6">Book Free Demo Class</h3>
              {demoSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-heading font-semibold text-lg">Demo class booked!</p>
                  <p className="text-muted-foreground text-sm mt-2">We will confirm the schedule shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleDemo} className="space-y-4">
                  <input type="text" placeholder="Student Name" required value={demoData.name} onChange={(e) => setDemoData({ ...demoData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="tel" placeholder="Phone Number" required value={demoData.phone} onChange={(e) => setDemoData({ ...demoData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <select required value={demoData.class} onChange={(e) => setDemoData({ ...demoData, class: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Class</option>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                  </select>
                  <input type="date" required value={demoData.preferredDate} onChange={(e) => setDemoData({ ...demoData, preferredDate: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <Button type="submit" variant="hero" className="w-full" size="lg">Book Demo Class</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Fee <span className="text-primary">Structure</span></h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="grid grid-cols-3 bg-primary text-primary-foreground p-4 font-heading font-semibold text-sm">
                <span>Level</span><span className="text-center">Monthly</span><span className="text-center">Yearly</span>
              </div>
              {fees.map((f, i) => (
                <div key={f.level} className={`grid grid-cols-3 p-4 text-sm ${i % 2 === 0 ? "bg-muted/50" : ""}`}>
                  <span className="font-medium">{f.level}</span>
                  <span className="text-center text-muted-foreground">{f.monthly}</span>
                  <span className="text-center font-semibold text-primary">{f.yearly}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">* EMI options available. Sibling discount applicable. Contact us for details.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admission;
