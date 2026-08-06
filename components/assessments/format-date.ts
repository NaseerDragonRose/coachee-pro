// Fixed locale and timezone rather than the viewer's: these render on the
// server, and letting either float would mean the markup depends on where the
// request was served from. Shared so the draft and completed cards can't drift
// into formatting the same dates differently.
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso))
