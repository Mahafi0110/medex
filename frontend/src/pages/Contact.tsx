import { FormEvent, useState } from "react";
import { api } from "@/api/client";
import { useAsync } from "@/hooks/useAsync";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import SectionHeading from "@/components/SectionHeading";
import Icon from "@/components/Icon";
import { LoadingState, ErrorState } from "@/components/AsyncState";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const intro = useAsync(() => api.getPageIntro("contact"), []);
  const content = useAsync(() => api.getContactPageContent(), []);
  const locations = useAsync(() => api.getOfficeLocations(), []);
  const services = useAsync(() => api.getServices(), []);
  const settings = useSiteSettings();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);

  const activeLocation =
    locations.data?.find((l) => l.id === activeLocationId) ?? locations.data?.[0] ?? null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
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
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative border-b border-line bg-white py-16 lg:py-24">
        <div className="container-page flex flex-col items-center justify-between gap-12 lg:flex-row">
          <div className="max-w-xl">
            {intro.loading && <LoadingState />}
            {intro.error && <ErrorState message={intro.error} />}
            {intro.data && (
              <>
                <span className="inline-block rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red">
                  {intro.data.eyebrow}
                </span>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight text-blue-dark md:text-5xl">
                  {intro.data.title}
                </h1>
                {intro.data.description && (
                  <p className="mt-4 text-base leading-relaxed text-muted">{intro.data.description}</p>
                )}
              </>
            )}
          </div>

          <div className="w-full lg:w-[460px]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
              {intro.data?.image ? (
                <img
                  src={intro.data.image}
                  alt="MedEx Support & Biomedical Services"
                  className="h-auto max-h-[300px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted">
                  Support / facility photo goes here
                </div>
              )}
            </div>
          </div>
          {/* <div className="w-full lg:w-[460px]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
              <img
                src={intro.data?.image || "/contact-hero.png"}
                alt="MedEx Support & Biomedical Services"
                className="h-auto max-h-[300px] w-full object-cover"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* 2. Enquiry form + contact details */}
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px]">
          <form onSubmit={handleSubmit} className="card space-y-5 p-8">
            {content.data && (
              <div>
                <h2 className="text-lg font-bold text-blue-dark">{content.data.form_title}</h2>
                {content.data.form_description && (
                  <p className="mt-0.5 text-xs text-muted">{content.data.form_description}</p>
                )}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your Name" name="name" required />
              <Field label="Organization / Hospital" name="organization" required />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone Number" name="phone" required />
              <Field label="Email Address" name="email" type="email" required />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Select Service / Product</label>
              <select
                name="subject"
                required
                defaultValue=""
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-blue"
              >
                <option value="" disabled>Select Service / Product</option>
                {services.data?.results.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Your Message</label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
              />
            </div>

            <button type="submit" disabled={status === "submitting"} className="btn-primary w-full justify-center">
              {status === "submitting" ? "Sending…" : "Submit Enquiry"}
            </button>

            {status === "success" && (
              <p className="text-center text-sm font-medium text-green-700">
                Thanks — your message has been sent. We'll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm font-medium text-red-dark">Couldn't send your message: {errorMsg}</p>
            )}

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <Icon name="shield" className="h-3.5 w-3.5" />
              Your information is safe with us.
            </p>
          </form>

          {/* Contact details card */}
          <div className="card grid gap-0 overflow-hidden border border-line bg-surface/50 p-0 sm:grid-cols-2">
            <div className="space-y-6 p-8">
              {content.data && (
                <div>
                  {content.data.details_eyebrow && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-red">
                      {content.data.details_eyebrow}
                    </span>
                  )}
                  <h3 className="mt-1 text-lg font-bold text-blue-dark">{content.data.details_title}</h3>
                  {content.data.details_subtitle && (
                    <p className="text-xs text-muted">{content.data.details_subtitle}</p>
                  )}
                </div>
              )}

              <div className="space-y-4 text-sm">
                {locations.data?.map((loc, i) => (
                  <div key={loc.id} className={i > 0 ? "space-y-1 border-t border-line pt-3" : "space-y-1"}>
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-blue-dark">
                      <Icon name="building" className="h-4 w-4 flex-shrink-0 text-red" />
                      {loc.name}
                    </h4>
                    <p className="pl-5 text-xs leading-relaxed text-muted">{loc.address}</p>
                  </div>
                ))}

                {settings?.phone && (
                  <div className="border-t border-line pt-3 text-xs">
                    <span className="block font-semibold text-blue-dark">Reach Us</span>
                    <span className="text-muted">{settings.phone}</span>
                  </div>
                )}
                {settings?.email && (
                  <div className="border-t border-line pt-3 text-xs">
                    <span className="block font-semibold text-blue-dark">Email</span>
                    <span className="text-muted">{settings.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 border-t border-line bg-pink-light/50 p-8 sm:border-l sm:border-t-0">
              <div className="space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red/10 text-red">
                  <Icon name="headset" className="h-4 w-4" />
                </div>
                {content.data?.highlights_intro && (
                  <p className="text-xs font-medium leading-relaxed text-muted">{content.data.highlights_intro}</p>
                )}
                {content.data && content.data.highlights.length > 0 && (
                  <ul className="space-y-2 pt-2 text-xs font-medium text-ink">
                    {content.data.highlights.map((h) => (
                      <li key={h.id} className="flex items-center gap-2">
                        <Icon name="check" className="h-3.5 w-3.5 text-red" />
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Map */}
        {locations.data && locations.data.length > 0 && (
          <div className="mt-20">
            {content.data && (
              <SectionHeading
                eyebrow={content.data.map_eyebrow}
                title={content.data.map_title}
                description={content.data.map_description}
              />
            )}

            <div className="mt-6 flex flex-wrap gap-4">
              {locations.data.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${(activeLocation?.id ?? locations.data![0].id) === loc.id
                      ? "bg-red text-white"
                      : "bg-surface text-ink hover:bg-line"
                    }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>

            <div className="mt-6 h-[400px] overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              {activeLocation?.map_embed_url ? (
                <iframe
                  title={activeLocation.name}
                  src={activeLocation.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  Map for {activeLocation?.name} goes here — add a Google Maps embed URL in Django Admin.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required = false,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}