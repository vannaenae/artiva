/**
 * Free-text address -> lat/lng, via OpenStreetMap's Nominatim search API.
 *
 * No API key needed (unlike Google Maps Geocoding) — Nominatim is a public,
 * unauthenticated service, which matters here since this project has no
 * backend to hide a paid geocoding key behind. Scoped to Nigeria for
 * relevance. Nominatim's usage policy caps clients at 1 request/second;
 * this is called once per verification submission, well under that.
 *
 * ponytail: Nigerian addresses are often landmark-based ("beside the blue
 * gate, opposite the filling station") rather than strictly geocodable —
 * Nominatim will fail or mis-locate plenty of real addresses. That's why
 * this returns null on any failure instead of throwing: callers fall back
 * to their estate's coordinates, which is already the existing behavior.
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const query = address.trim();
  if (!query) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ng&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;

    const results: Array<{ lat: string; lon: string }> = await res.json();
    const first = results[0];
    if (!first) return null;

    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}
