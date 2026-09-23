import { FormEvent, useState } from "react";
import { api } from "@/api/client";
import SectionHeading from "@/components/SectionHeading";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"chennai" | "madurai">("chennai");

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget; // 1. Store a reference to the form element
    const form = new FormData(formElement);
    
    setStatus("submitting");
    try {
      await api.submitContact({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        organization: String(form.get("organization") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setStatus("success");
      formElement?.reset(); // 2. Safely call reset on the captured element reference
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }
  return (
    <div>
      {/* 1. Hero Banner Section (White background with right-side image layout) */}
      <section className="relative bg-white py-16 lg:py-24 border-b border-line">
        <div className="container-page flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Content */}
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red">
              Contact Us
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-blue-dark md:text-5xl">
              Let's Keep Healthcare Technology Running
            </h1>
            <p className="mt-4 text-base text-muted leading-relaxed">
              Tell us what you need serviced, calibrated or installed — our expert biomedical team will get back to you fast.
            </p>
          </div>

          {/* Right Side Hero Image/Graphic */}
          <div className="w-full lg:w-[460px]">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-line bg-surface">
              <img
                src="/contact-hero.png"
                alt="MedEx Support & Biomedical Services"
                className="w-full h-auto object-cover max-h-[300px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Enquiry & Details Section */}
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px]">
          {/* Send Us an Enquiry Form */}
          <form onSubmit={handleSubmit} className="card space-y-5 p-8">
            <div>
              <h2 className="text-lg font-bold text-blue-dark">Send Us an Enquiry</h2>
              <p className="text-xs text-muted mt-0.5">Fill in the details and our team will get back to you shortly.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your Name *" name="name" required placeholder="Your Name *" />
              <Field label="Organization / Hospital *" name="organization" required placeholder="Organization / Hospital *" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone Number *" name="phone" required placeholder="Phone Number *" />
              <Field label="Email Address *" name="email" type="email" required placeholder="Email Address *" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Select Service / Product *</label>
              <select
                name="subject"
                required
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-blue text-ink"
              >
                <option value="">Select Service / Product *</option>
                <option value="Biomedical Equipment Support">Biomedical Equipment Support</option>
                <option value="Digital Health Solutions">Digital Health Solutions</option>
                <option value="Hospital Maintenance">Hospital Maintenance</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Your Message *</label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Your Message *"
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
              />
            </div>

            <button type="submit" disabled={status === "submitting"} className="btn-primary w-full justify-center">
              {status === "submitting" ? "Sending…" : "Submit Enquiry"}
            </button>

            {status === "success" && (
              <p className="text-sm font-medium text-green-700 text-center">
                Thanks — your message has been sent. We'll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm font-medium text-red-dark text-center">Couldn't send your message: {errorMsg}</p>
            )}

            <p className="text-center text-xs text-muted">🔒 Your information is safe with us.</p>
          </form>

          {/* Contact Details Card */}
          <div className="card grid gap-0 overflow-hidden p-0 border border-line bg-surface/50 sm:grid-cols-2">
            {/* Left side: Addresses, Reach Us, & Email */}
            <div className="space-y-6 p-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-red">Support & Reach</span>
                <h3 className="text-lg font-bold text-blue-dark mt-1">Our Contact Details</h3>
                <p className="text-xs text-muted">Reach out to us.</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-dark flex items-center gap-1.5 text-xs">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 21c-4.97-4.97-8-8.97-8-12a8 8 0 1116 0c0 3.03-3.03 7.03-8 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    Head Office — Chennai
                  </h4>
                  <p className="text-muted text-xs leading-relaxed pl-5">
                    No.134/2 C, Gandhi Road, Srinivasa Nagar Post, Alapakkam, near Perungalathur, Chennai - 600 063
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-line">
                  <h4 className="font-semibold text-blue-dark flex items-center gap-1.5 text-xs">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 21c-4.97-4.97-8-8.97-8-12a8 8 0 1116 0c0 3.03-3.03 7.03-8 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    Branch — Madurai
                  </h4>
                  <p className="text-muted text-xs leading-relaxed pl-5">
                    Vadipatti, Madurai, Tamil Nadu, India
                  </p>
                </div>

                <div className="pt-3 border-t border-line text-xs">
                  <span className="font-semibold text-blue-dark block">Reach Us</span>
                  <span className="text-muted">+91 93037 06371</span>
                </div>

                <div className="pt-3 border-t border-line text-xs">
                  <span className="font-semibold text-blue-dark block">Email</span>
                  <span className="text-muted">support@medexbiomed.com</span>
                </div>
              </div>
            </div>

            {/* Right side: Support Highlights block with soft pink background */}
            <div className="space-y-4 p-8 bg-pink-light/50 flex flex-col justify-between border-t border-line sm:border-t-0 sm:border-l sm:border-line">
              <div className="space-y-3">
                <div className="h-8 w-8 rounded-full bg-red/10 flex items-center justify-center text-red font-bold">
                  🎧
                </div>
                <p className="text-xs text-muted leading-relaxed font-medium">
                  We're always here to support your healthcare technology needs.
                </p>
                <ul className="space-y-2 text-xs font-medium text-ink pt-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red font-bold">✔</span> Quick Response
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red font-bold">✔</span> Expert Support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red font-bold">✔</span> Reliable Partnership
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Find Us on Map Section */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Location"
            title="Find Us on Map"
            description="Get directions to our Head Office in Chennai or our Branch in Madurai."
          />

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setActiveTab("chennai")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "chennai" ? "bg-red text-white" : "bg-surface text-ink hover:bg-line"
              }`}
            >
              Head Office – Chennai
            </button>
            <button
              onClick={() => setActiveTab("madurai")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "madurai" ? "bg-red text-white" : "bg-surface text-ink hover:bg-line"
              }`}
            >
              Branch – Madurai
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm h-[400px]">
            {activeTab === "chennai" ? (
              <iframe
                title="Chennai Head Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8953151833595!2d80.098!3d12.923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzI0LjgiTiA4MCUwNSc1Mi44IkU!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            ) : (
              <iframe
                title="Madurai Branch Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.85!2d78.1198!3d9.9252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sOcKwNTUnMzAuNyJOIDc4wrAwNzExLjMiRQ!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue placeholder:text-muted/60"
      />
    </div>
  );
}