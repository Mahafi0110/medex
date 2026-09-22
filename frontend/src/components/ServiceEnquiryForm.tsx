import { FormEvent, useState } from "react";
import { api } from "@/api/client";
import type { ServicePageDetail } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

export default function ServiceEnquiryForm({ page }: { page: ServicePageDetail }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    if (page.form_type === "career_application") {
      const payload = new FormData();
      payload.set("name", get("full_name"));
      payload.set("email", get("email"));
      payload.set("phone", get("mobile_number"));
      payload.set("subject", `Career application — ${get("role")}`);
      payload.set("interested_in", get("role"));
      payload.set("message", "");
      const resumeFile = form.get("resume");
      if (resumeFile instanceof File && resumeFile.size > 0) {
        payload.set("resume", resumeFile);
      }
      payload.set(
        "additional_info",
        [
          get("dob") && `Date of Birth: ${get("dob")}`,
          get("qualification") && `Qualification: ${get("qualification")}`,
          get("college") && `College: ${get("college")}`,
          get("completion_year") && `Year of Completion: ${get("completion_year")}`,
          get("previous_employer") && `Previous Employer: ${get("previous_employer")}`,
          get("base_location") && `Base Location: ${get("base_location")}`,
          get("experience") && `Experience: ${get("experience")}`,
          get("experience_duration") && `Experience Duration: ${get("experience_duration")}`,
          get("address") && `Address: ${get("address")}`,
          get("pincode") && `Pin Code: ${get("pincode")}`,
          get("city") && `City: ${get("city")}`,
          get("state") && `State: ${get("state")}`,
        ].filter(Boolean).join("\n"),
      );

      setStatus("submitting");
      try {
        await api.submitContactMultipart(payload);
        setStatus("success");
        e.currentTarget?.reset();
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
      return;
    }

    let name = "";
    let email = "";
    let phone = "";
    let organization = "";
    let interestedIn = "";
    let extraLines: string[] = [];

    if (page.form_type === "support_demo") {
      name = get("customer_name");
      email = get("email");
      phone = get("mobile_number") || get("landline");
      interestedIn = get("product_name");
      extraLines = [
        get("landline") && `Landline: ${get("landline")}`,
        get("model_number") && `Model: ${get("model_number")}`,
        get("serial_number") && `Serial Number: ${get("serial_number")}`,
        get("purchase_year") && `Year of Purchase: ${get("purchase_year")}`,
        get("landmark") && `Landmark: ${get("landmark")}`,
        get("pincode") && `Pin Code: ${get("pincode")}`,
        get("city") && `City: ${get("city")}`,
        get("state") && `State: ${get("state")}`,
      ].filter(Boolean) as string[];
    } else if (page.form_type === "training_enquiry") {
      name = get("full_name");
      email = get("email");
      phone = get("mobile_number");
      organization = get("organization");
      interestedIn = get("training_requirement");
      extraLines = [
        get("preferred_date") && `Preferred Date: ${get("preferred_date")}`,
        get("city") && `City/Location: ${get("city")}`,
      ].filter(Boolean) as string[];
    } else {
      name = get("name");
      email = get("email");
    }

    setStatus("submitting");
    try {
      await api.submitContact({
        name,
        email,
        phone,
        organization,
        subject: `${page.nav_label} enquiry`,
        interested_in: interestedIn,
        additional_info: extraLines.join("\n"),
        message: get("message"),
      });
      setStatus("success");
      e.currentTarget?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const trainingOptions = page.feature_items.map((f) => f.title);

  return (
    <div className="card p-6">
      {page.form_title && <h3 className="text-lg font-semibold text-blue-dark">{page.form_title}</h3>}
      {page.form_description && <p className="mt-1 text-sm text-muted">{page.form_description}</p>}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {page.form_type === "support_demo" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer Name" name="customer_name" required />
              <Field label="Mobile Number" name="mobile_number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Landline" name="landline" />
              <Field label="Email Address" name="email" type="email" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Product Name" name="product_name" />
              <Field label="Model Name and Number" name="model_number" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Serial Number" name="serial_number" />
              <Field label="Year of Manufacture / Purchase" name="purchase_year" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brief about the issue" name="issue_brief" />
              <Field label="Landmark" name="landmark" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pin code" name="pincode" />
              <Field label="City" name="city" />
            </div>
            <Field label="State" name="state" />
            <TextArea label="Detailed Message" name="message" />
            <SubmitButton status={status} label="Submit Service Request" />
          </>
        )}

        {page.form_type === "training_enquiry" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" name="full_name" required />
              <Field label="Mobile Number" name="mobile_number" required />
            </div>
            <Field label="Email Address" name="email" type="email" required />
            <Field label="Organization / Institution" name="organization" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Training Requirement</label>
              <select
                name="training_requirement"
                defaultValue=""
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-blue"
              >
                <option value="" disabled>Select Training Requirement</option>
                {trainingOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Training Date" name="preferred_date" type="date" />
              <Field label="City / Location" name="city" />
            </div>
            <TextArea label="Detailed Message" name="message" />
            <SubmitButton status={status} label="Submit Training Request" />
          </>
        )}

        {page.form_type === "general" && (
          <>
            <Field label="Your Name" name="name" required />
            <Field label="Email Address" name="email" type="email" required />
            <TextArea label="Message" name="message" required />
            <SubmitButton status={status} label="Submit" />
          </>
        )}

        {page.form_type === "career_application" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" name="full_name" required />
              <Field label="DOB" name="dob" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Mobile Number" name="mobile_number" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Qualification" name="qualification" placeholder="e.g. B.E Biomedical" required />
              <Field label="College Name" name="college" placeholder="University / College" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Year of Completion" name="completion_year" placeholder="e.g. 2023" required />
              <Field label="Previous Employer" name="previous_employer" placeholder="Company Name or Freshers" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Base Location" name="base_location" placeholder="Preferred City" required />
              <Field label="Role" name="role" placeholder="e.g. Service Engineer" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Experience" name="experience" placeholder="e.g. 2 Years" required />
              <Field label="Year and Month" name="experience_duration" placeholder="e.g. 2 yrs 4 mos" />
            </div>
            <Field label="Address" name="address" placeholder="Street address" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pincode" name="pincode" placeholder="6-digit pincode" required />
              <Field label="City" name="city" placeholder="City name" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">State *</label>
              <select
                name="state"
                required
                defaultValue=""
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-blue"
              >
                <option value="" disabled>Select State</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <FileField label="Resume Upload" name="resume" required />
            <SubmitButton status={status} label="Send Application" />
          </>
        )}

        {status === "success" && (
          <p className="text-sm font-medium text-green-700">Thanks — we'll be in touch shortly.</p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-dark">Couldn't send: {errorMsg}</p>
        )}

        <p className="flex items-center gap-1.5 text-xs text-muted">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
          </svg>
          Your information is safe with us.
        </p>
      </form>
    </div>
  );
}

function Field({
  label, name, type = "text", required = false, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}{required && " *"}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}

function FileField({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}{required && " *"}
      </label>
      <input
        name={name}
        type="file"
        required={required}
        accept=".pdf,.doc,.docx"
        className="w-full rounded-lg border border-line px-3 py-2 text-sm text-muted outline-none file:mr-3 file:rounded-md file:border-0 file:bg-pink-light file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-red"
      />
    </div>
  );
}

function TextArea({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}{required && " *"}
      </label>
      <textarea
        name={name}
        required={required}
        rows={4}
        maxLength={180}
        placeholder="Enter your detailed requirements or issue..."
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-blue"
      />
    </div>
  );
}

function SubmitButton({ status, label }: { status: Status; label: string }) {
  return (
    <button type="submit" disabled={status === "submitting"} className="btn-primary w-full justify-center">
      {status === "submitting" ? "Sending…" : label}
    </button>
  );
}