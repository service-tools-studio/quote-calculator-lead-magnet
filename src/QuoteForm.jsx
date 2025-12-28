import React, { useEffect, useRef } from "react";

const CLEANING_TYPES = [
  { value: "standard", label: "Standard Cleaning" },
  { value: "deep", label: "Deep Cleaning" },
  { value: "moveout", label: "Move-Out Cleaning" },
];

const ADDONS = [
  { key: "fridge", label: "Inside Fridge" },
  { key: "oven", label: "Inside Oven" },
  { key: "cabinets", label: "Inside Cabinets" },
];

function FieldLabel({ children }) {
  return (
    <div className="text-sm font-medium text-neutral-800 mb-1">{children}</div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 " +
        className
      }
    />
  );
}

function Select({ className = "", ...props }) {
  return (
    <select
      {...props}
      className={
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 " +
        className
      }
    />
  );
}

export default function QuoteForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  submitted,
  quote,
  formatUSD,
}) {
  const v = value;

  const successRef = useRef(null);
  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [submitted]);


  function set(patch) {
    onChange({ ...v, ...patch });
  }

  function toggleAddon(key) {
    const current = new Set(v.selectedAddons);
    if (current.has(key)) current.delete(key);
    else current.add(key);
    set({ selectedAddons: Array.from(current) });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-6"
    >
      {/* 1) Home details */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-neutral-900">
          Home details
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <Select
              value={v.bedrooms}
              onChange={(e) => set({ bedrooms: e.target.value })}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <Select
              value={v.bathrooms}
              onChange={(e) => set({ bathrooms: e.target.value })}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Cleaning type</FieldLabel>
            <Select
              value={v.cleaningType}
              onChange={(e) => set({ cleaningType: e.target.value })}
            >
              {CLEANING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Add-ons</FieldLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {ADDONS.map((a) => {
                const checked = v.selectedAddons.includes(a.key);
                return (
                  <button
                    type="button"
                    key={a.key}
                    onClick={() => toggleAddon(a.key)}
                    className={
                      "rounded-2xl border px-3 py-2 text-sm text-left transition shadow-sm " +
                      (checked
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400")
                    }
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Optional — choose any that apply.
            </div>
          </div>
        </div>
      </div>

      {/* 2) Your estimate */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-neutral-900">
          Your estimate
        </div>

        <div className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
          {formatUSD(quote.low)} – {formatUSD(quote.high)}
        </div>


        <div className="mt-2 text-sm text-neutral-600">
          Based on bedrooms, bathrooms, cleaning type, and selected add-ons.
        </div>

        <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
          <div className="font-medium text-neutral-900">What happens next</div>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Enter your details below to send us your estimate request.</li>
            <li>We’ll review your information and confirm availability.</li>
            <li>We’ll follow up with exact pricing and booking options.</li>
          </ul>
        </div>
      </div>

      {/* 3) Where should we send your estimate? */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-neutral-900">
          Where should we send your estimate?
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel>Name</FieldLabel>
            <Input
              value={v.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <FieldLabel>Email</FieldLabel>
            <Input
              value={v.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="you@email.com"
              type="email"
              required
            />
          </div>

          <div>
            <FieldLabel>Phone</FieldLabel>
            <Input
              value={v.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="(555) 555-5555"
              inputMode="tel"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Zip code</FieldLabel>
            <Input
              value={v.zip}
              onChange={(e) => set({ zip: e.target.value })}
              placeholder="97201"
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-2xl bg-neutral-900 px-4 py-3 text-white font-semibold shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Send my estimate request"}
        </button>

        <div className="mt-3 text-xs text-neutral-500">
          By submitting, you agree we may contact you about your cleaning quote.
        </div>
      </div>

      {submitted && (
        <div ref={successRef} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="font-semibold text-neutral-900">Submitted ✅</div>
          <div className="mt-1 text-sm text-neutral-600">
            We received your request and will reach out shortly.
          </div>
        </div>
      )}
    </form>
  );
}
