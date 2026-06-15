/**
 * Background service worker — owns the network call to Ideary.
 *
 * The popup extracts the conversation (via the content script) and hands the
 * payload here; the worker POSTs it to the import endpoint and relays the
 * result. Keeping the fetch here means host permissions are enough — no CORS
 * dance — and the popup stays purely about UI.
 */

const IMPORT_URL = "https://ideary.vercel.app/api/eureka/import";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || msg.type !== "IDEARY_IMPORT") return;

  (async () => {
    try {
      const res = await fetch(IMPORT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg.payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        sendResponse({
          ok: false,
          error: json.error || `Import failed (HTTP ${res.status}).`,
        });
        return;
      }

      // { eureka_id, status: "created" | "updated" | "extraction_failed" }
      sendResponse({ ok: true, ...json });
    } catch (err) {
      sendResponse({
        ok: false,
        error: err && err.message ? err.message : String(err),
      });
    }
  })();

  // Async response — keep the message channel open.
  return true;
});
