import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, UserPlus, ClipboardList, CreditCard, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const defaultSteps = [
  { icon: FileText, title: "Fill Enquiry Form", desc: "Submit the online enquiry form or visit our center." },
  { icon: ClipboardList, title: "Attend Demo Class", desc: "Experience our teaching style with a free demo class." },
  { icon: UserPlus, title: "Complete Registration", desc: "Fill the admission form and submit required documents." },
  { icon: CreditCard, title: "Pay Fees & Start", desc: "Complete fee payment and begin your learning journey." },
];

const defaultFees = [
  { level: "Pre-Primary (Nursery-Sr.KG)", monthly: "₹1,000", yearly: "₹10,000" },
  { level: "Primary (1-4)", monthly: "₹1,500", yearly: "₹15,000" },
  { level: "Secondary (5-10)", monthly: "₹2,500", yearly: "₹25,000" },
  { level: "Special Batch (8,9,10)", monthly: "₹3,000", yearly: "₹30,000" },
];

const stepIcons = [FileText, ClipboardList, UserPlus, CreditCard];

const Admission = () => {
  useScrollAnimation();
  const { getContent, getListItems } = useCmsContent("admission");
  const [formData, setFormData] = useState({ name: "", phone: "", class: "", message: "" });
  const [demoData, setDemoData] = useState({ name: "", phone: "", class: "", preferredDate: "" });
  const [submitted, setSubmitted] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const heroTitle = getContent("hero_title", "Admission & Enquiry");
  const heroSubtitle = getContent("hero_subtitle", "Join Pal Classes today. Fill the form below or book a free demo class to experience our teaching.");
  const processTitle = getContent("process_title", "Admission Process");
  const feesTitle = getContent("fees_title", "Fee Structure");
  const feesNote = getContent("fees_note", "* EMI options available. Sibling discount applicable. Contact us for details.");

  const cmsSteps = getListItems("step", ["title", "desc"]);
  const steps = cmsSteps.length > 0 ? cmsSteps : defaultSteps;

  const cmsFees = getListItems("fee", ["level", "monthly", "yearly"]);
  const fees = cmsFees.length > 0 ? cmsFees : defaultFees;

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/enquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: 'general' }),
      });

      if (!response.ok) throw new Error("Failed");

      setSubmitted(true);
      toast.success("Enquiry submitted successfully!");
      setFormData({ name: "", phone: "", class: "", message: "" });
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/enquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: demoData.name,
          phone: demoData.phone,
          class: demoData.class,
          preferredDate: demoData.preferredDate,
          type: 'demo',
          message: 'Demo Class Request', // Optional filler
          email: 'demo@request.com' // Optional filler if email is required in model but not form
        }),
      });

      if (!response.ok) throw new Error("Failed");

      setDemoSubmitted(true);
      toast.success("Demo class booked successfully!");
      setDemoData({ name: "", phone: "", class: "", preferredDate: "" });
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
    }
    setDemoSubmitting(false);
  };

  return (
    <>
      <section className="bg-hero-gradient py-20">
        <div className="container text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">{heroTitle}</h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12" dangerouslySetInnerHTML={{ __html: processTitle.replace(/(Process)/, '<span class="text-primary">$1</span>') }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step: any, i: number) => {
              const Icon = stepIcons[i % stepIcons.length];
              return (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-section-gradient">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl border p-5 sm:p-6 md:p-8">
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-6">Enquiry Form</h3>
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
                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Submit Enquiry
                  </Button>
                </form>
              )}
            </div>

            <div className="bg-card rounded-2xl border p-5 sm:p-6 md:p-8">
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-6">Book Free Demo Class</h3>
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
                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={demoSubmitting}>
                    {demoSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Book Demo Class
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12" dangerouslySetInnerHTML={{ __html: feesTitle.replace(/(Structure)/, '<span class="text-primary">$1</span>') }} />
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
              <div className="grid grid-cols-3 bg-primary text-primary-foreground p-3 sm:p-4 font-heading font-semibold text-xs sm:text-sm min-w-[320px]">
                <span>Level</span><span className="text-center">Monthly</span><span className="text-center">Yearly</span>
              </div>
              {fees.map((f: any, i: number) => (
                <div key={i} className={`grid grid-cols-3 p-3 sm:p-4 text-xs sm:text-sm min-w-[320px] ${i % 2 === 0 ? "bg-muted/50" : ""}`}>
                  <span className="font-medium">{f.level}</span>
                  <span className="text-center text-muted-foreground">{f.monthly}</span>
                  <span className="text-center font-semibold text-primary">{f.yearly}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground text-xs sm:text-sm mt-4">{feesNote}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Admission;
