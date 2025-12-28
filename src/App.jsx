import React, { useMemo, useState } from "react";
import QuoteForm from "./QuoteForm";
import { calculateQuote, formatUSD } from "./pricing";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyEB0ZFVqMv6UA0ccAeIrYSo1R4KsZXqsbQe9rlXJiCLUsEky3vA8NJ8embGgcovefSUA/exec";

export default function App() {
  const [form, setForm] = useState({
    bedrooms: "2",
    bathrooms: "1",
    cleaningType: "standard",
    selectedAddons: [],
    name: "",
    email: "",
    phone: "",
    zip: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const quote = useMemo(() => {
    return calculateQuote({
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      cleaningType: form.cleaningType,
      selectedAddons: form.selectedAddons,
    });
  }, [form]);

  async function handleSubmit() {
    setIsSubmitting(true);

    try {
      const payload = {
        // quote inputs
        bedrooms: String(form.bedrooms),
        bathrooms: String(form.bathrooms),
        cleaningType: String(form.cleaningType),
        addOns: (form.selectedAddons || []).join(","),

        // contact
        name: form.name,
        email: form.email,
        phone: form.phone,
        zip: form.zip,

        // computed quote
        quoteLow: String(quote.low),
        quoteHigh: String(quote.high),

        // metadata
        source: "instant-quote-calculator-v1",

        // honeypot (keep empty)
        company_website: "",
      };

      const params = new URLSearchParams(payload);

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: params, // form-encoded avoids most CORS/preflight issues
      });

      const text = await res.text();
      console.log("RAW Apps Script response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        // If Apps Script returns non-JSON for any reason
        data = { success: true };
      }

      if (!data.success) throw new Error(data.error || "Submission failed");

      if (!data.success) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert(
        "Something went wrong submitting your estimate. Please try again. (Check console for details.)"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 to-amber-500" />
            Instant estimate in under 60 seconds
            <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-100">
              Demo
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
            Get your instant cleaning estimate
          </h1>
          <p className="max-w-2xl text-neutral-600">
            Answer a few quick questions and we’ll send your estimate instantly.
            Final pricing is confirmed after we review your home details.
          </p>
        </header>

        <div className="mt-8 space-y-6">
          <QuoteForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitted={submitted}
            quote={quote}
            formatUSD={formatUSD}
          />
        </div>

        <footer className="mt-16 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          <div className="flex flex-col gap-1">
            <div>
              Built by <span className="font-medium text-neutral-700">Service Tools Studio</span>
            </div>
            <div>
              Interested in using this for your business?{" "}
              <a
                href="mailto:service.tools.studio@gmail.com"
                className="underline underline-offset-2 hover:text-neutral-700"
              >
                Get in touch 💌
              </a>
              <div>
                <small><i>Branding is fully customizable (logo, colors, copy).</i></small>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
