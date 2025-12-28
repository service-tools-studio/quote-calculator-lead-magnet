// src/pricing.js

export const PRICING = {
  currency: "USD",

  // Base rates (easy to tune per client)
  rates: {
    perBedroom: 35,
    perBathroom: 45,
  },

  // Multipliers by service type
  multipliers: {
    standard: 1.0,
    deep: 1.35,
    moveout: 1.6,
  },

  // Flat add-on prices
  addons: {
    fridge: 25,
    oven: 25,
    cabinets: 40,
  },

  // Range for estimate (±10% default)
  range: {
    lowMultiplier: 0.9,
    highMultiplier: 1.1,
  },

  // Guardrails (optional)
  minimums: {
    standard: 120,
    deep: 180,
    moveout: 240,
  },
};

export function calculateQuote({
  bedrooms,
  bathrooms,
  cleaningType,
  selectedAddons,
}) {
  const beds = Number(bedrooms || 0);
  const baths = Number(bathrooms || 0);

  const base =
    beds * PRICING.rates.perBedroom + baths * PRICING.rates.perBathroom;

  const typeKey = cleaningType || "standard";
  const multiplier = PRICING.multipliers[typeKey] ?? 1.0;

  const addonsTotal = (selectedAddons || []).reduce((sum, key) => {
    return sum + (PRICING.addons[key] ?? 0);
  }, 0);

  const subtotal = base * multiplier + addonsTotal;

  const min = PRICING.minimums[typeKey] ?? 0;
  const guarded = Math.max(subtotal, min);

  const low = Math.round(guarded * PRICING.range.lowMultiplier);
  const high = Math.round(guarded * PRICING.range.highMultiplier);

  return { low, high, subtotal: Math.round(guarded) };
}

export function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: PRICING.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
