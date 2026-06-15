/**
 * Content script — runs on claude.ai pages.
 *
 * It owns no extraction logic of its own. Instead it picks the right provider
 * from window.IdearyExtractors (registered by providers/*.js, which are injected
 * before this file) and responds to extract requests from the popup.
 */

(function () {
  function getExtractor(url) {
    const registry = window.IdearyExtractors || {};
    for (const name of Object.keys(registry)) {
      try {
        if (registry[name].matches(url)) return registry[name];
      } catch {
        // A broken provider shouldn't take down the others.
      }
    }
    return null;
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || msg.type !== "IDEARY_EXTRACT") return;

    const extractor = getExtractor(location.href);
    if (!extractor) {
      sendResponse({
        ok: false,
        error: "This page isn't a supported conversation.",
      });
      return;
    }

    try {
      sendResponse({ ok: true, data: extractor.extract() });
    } catch (err) {
      sendResponse({
        ok: false,
        error: err && err.message ? err.message : String(err),
      });
    }
    // Response is sent synchronously; no need to return true.
  });
})();
