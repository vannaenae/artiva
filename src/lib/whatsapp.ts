/**
 * "Share via WhatsApp" links — not the WhatsApp Business Platform API.
 *
 * The Business Platform API (for sending automated/templated messages) needs
 * a Meta Business verification, a WABA (WhatsApp Business Account), and a
 * paid per-conversation billing setup — none of which exist yet, and none of
 * which this static SPA could hold credentials for safely even if they did.
 *
 * What's genuinely useful today, with zero setup: wa.me deep links. These
 * just open WhatsApp (web or app) with a message pre-filled, for the human
 * to review and send themselves — no API, no key, no account. WhatsApp is
 * the dominant messaging app in Nigeria, so this is a real improvement over
 * "copy to clipboard" for anything that needs sharing, like an estate gate
 * code.
 */

// wa.me needs digits only (no +, spaces, or dashes) — build one loosely, it
// only affects a link's prefilled recipient, never blocks sending.
function digitsOnly(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Build a wa.me share link. Pass `phone` to prefill a specific recipient
 * (Nigerian numbers work as +234XXXXXXXXXX or 0XXXXXXXXXX); omit it to let
 * the user pick who to send to from their own WhatsApp contacts.
 */
export function buildWhatsAppShareUrl(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  const digits = phone ? digitsOnly(phone) : '';
  return digits ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

export function shareViaWhatsApp(message: string, phone?: string): void {
  window.open(buildWhatsAppShareUrl(message, phone), '_blank', 'noopener,noreferrer');
}
