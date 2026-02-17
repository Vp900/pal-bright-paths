import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCmsContent } from "@/hooks/useCms";

const Contact = () => {
  useScrollAnimation();
  const { getContent } = useCmsContent("contact");
  const globalCms = useCmsContent("global");

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const heroTitle = getContent("hero_title", "Contact Us");
  const heroSubtitle = getContent("hero_subtitle", "Have questions? We'd love to hear from you. Reach out to us anytime — we're here to help your child succeed.");
  const contactHeading = getContent("contact_heading", "Get in Touch");
  const contactText = getContent("contact_text", "Whether you want to inquire about admissions, course details, or schedule a visit — feel free to contact us. Our team is ready to assist you.");
  const formHeading = getContent("form_heading", "Send us a Message");

  const address = globalCms.getContent("address", "17, 2/4 Barkat Ali Nagar, Salt Pans Road,\nWadala East, Mumbai – 400037,\nMaharashtra, India");
  const phone1 = globalCms.getContent("phone1", "+91 80803 21805");
  const phone2 = globalCms.getContent("phone2", "+91 97683 87999");
  const email1 = globalCms.getContent("email1", "info@palclasses.com");
  const email2 = globalCms.getContent("email2", "admissions@palclasses.com");
  const workingHours = globalCms.getContent("working_hours", "Mon - Sat: 7:00 AM - 8:00 PM\nSunday: 9:00 AM - 2:00 PM");
  const whatsappNumber = globalCms.getContent("whatsapp_number", "918080321805");
  const mapUrl = globalCms.getContent("map_embed_url", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d72.8685!3d19.0178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf26f4e8b7e5%3A0x7b3cfb6e7a7a6f9a!2sWadala%20East%2C%20Mumbai%2C%20Maharashtra%20400037!5e0!3m2!1sen!2sin!4v1700000000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">{contactHeading}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{contactText}</p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href={`tel:${phone1.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{phone1}</a> (Primary)<br />
                      <a href={`tel:${phone2.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{phone2}</a>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">{email1}<br />{email2}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Working Hours</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">{workingHours}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(142,70%,45%)]/10 flex items-center justify-center shrink-0"><MessageCircle className="w-5 h-5 text-[hsl(142,70%,45%)]" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">WhatsApp</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Chat with us on WhatsApp</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <h3 className="font-heading text-xl font-bold mb-6">{formHeading}</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-heading font-semibold text-lg">Message sent successfully!</p>
                  <p className="text-muted-foreground text-sm mt-2">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <textarea placeholder="Your Message" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring h-32 resize-none" />
                  <Button type="submit" className="w-full" size="lg">Send Message</Button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-16 rounded-2xl overflow-hidden border shadow-sm">
            <iframe
              src={mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pal Classes Location"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
