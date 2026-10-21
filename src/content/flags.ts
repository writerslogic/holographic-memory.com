// Build-time switch for the Cloud checkout buttons. Off by default: paid tiers link
// to the waitlist until /api/hms/checkout is live and the build sets
// VITE_HMS_CHECKOUT_ENABLED=true.
export const HMS_CHECKOUT_ENABLED =
  import.meta.env.VITE_HMS_CHECKOUT_ENABLED === "true";
