import { FormEvent, useState } from "react";
import { api } from "@/api/client";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import type { Service, ProductHighlight } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  services: Service[];
  products: ProductHighlight[];
}

export default function ContactCTASection({ services, products }: Props) {
  const settings = useSiteSettings();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("submitting");
    try {
      await api.submitContact({
        name: String(form.get("name") ?? ""),
        organization: String(form.get("organization") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        interested_in: String(form.get("interested_in") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="container-page pb-20">
      <div className="card grid gap-8 bg-pink-light p-8 lg:grid-cols-2 lg:p-10">
        {/* Left: photo + quick contact */}
        <div className="flex flex-col">
          <div className="aspect-[4/3] overflow-hidden rounded-card bg-white">
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              Clinical / patient-care photo goes here
            </div>
          </div>

          <p className="section-eyebrow mt-6 mb-2">— Connect With Us</p>
          <h2 className="text-2xl font-bold text-blue-dark md:text-3xl">
            Let's Keep Your Healthcare Technology Running.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Get in touch with our team for emergency biomedical services, refurbished equipment,
            or enterprise hospital partnership opportunities.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {settings?.phone && (
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="btn-primary">
                Call Us Directly
              </a>
            )}
            {settings?.whatsapp_link && (
              <a href={settings.whatsapp_link} target="_blank" rel="noreferrer" className="btn bg-whatsapp text-white hover:brightness-95">
                WhatsApp Us
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="btn-outline">
                Email Us
              </a>
            )}
          </div>

          <blockquote className="mt-6 text-sm italic text-muted">
            "Precision Engineering for a Healthier Tomorrow."
            <footer className="mt-1 not-italic text-xs">— MedEx Biomed</footer>
          </blockquote>
        </div>

        {/* Right: quick enquiry form */}
        <form onSubmit={handleSubmit} className="card space-y-4 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your Name" name="name" placeholder="e.g. Dr. Ramesh Kumar" required />
            <Field label="Organization / Hospital" name="organization" placeholder="e.g. Apex Multi-specialty Hospital" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" required />
            <Field label="Email Address" name="email" type="email" placeholder="you@hospital.com" required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Select Service / Product</label>
            <select
              name="interested_in"
              className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {services.map((s) => (
                <option key={`service-${s.id}`} value={s.name}>
                  {s.name}
                </option>
              ))}
              {products.map((p) => (
                <option key={`product-${p.id}`} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Your Message / Equipment Details</label>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Provide details about the medical equipment issue, model, or requested service timeline."
              className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" required className="mt-0.5" />
            I agree to the Terms & Conditions and clinical data handling policy.
          </label>

          <button type="submit" disabled={status === "submitting"} className="btn-primary w-full justify-center">
            {status === "submitting" ? "Sending…" : "Submit Enquiry"}
          </button>

          {status === "success" && (
            <p className="text-sm font-medium text-green-700">Thanks — we'll be in touch shortly.</p>
          )}
          {status === "error" && (
            <p className="text-sm font-medium text-red-dark">Couldn't send: {errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", placeholder, required = false,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label} *</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}