/**
 * Claude conversation extractor.
 *
 * COMMON EXTRACTOR INTERFACE
 * --------------------------
 * Every provider registers an object on `window.IdearyExtractors[name]` with:
 *
 *   matches(url: string): boolean
 *       — true if this provider can handle the current page.
 *
 *   extract(): { provider, conversation_id, messages }
 *       — reads the conversation from the DOM. Throws an Error (with a
 *         human-readable message) if it can't. `messages` is an ordered
 *         array of { role: "user" | "assistant", content: string }.
 *
 * To add ChatGPT or Gemini later, drop a providers/chatgpt.js (or gemini.js)
 * that follows the same shape, register it on window.IdearyExtractors, and
 * add it to the content_scripts "js" array in manifest.json.
 */

(function () {
  // ─────────────────────────────────────────────────────────────────────────
  // SELECTORS — Claude's DOM changes often. Everything fragile lives here so
  // that when capture breaks, this is the only block you need to fix.
  // ─────────────────────────────────────────────────────────────────────────
  const SEL = {
    // A conversation page looks like https://claude.ai/chat/<uuid>.
    // Group 1 is the conversation_id.
    CONVERSATION_URL: /^https:\/\/claude\.ai\/chat\/([0-9a-fA-F-]+)/,

    // A single user turn. Claude tags the user's message bubble with this.
    USER_MESSAGE: '[data-testid="user-message"]',

    // A single Claude (assistant) turn. This class wraps Claude's rendered
    // markdown response.
    ASSISTANT_MESSAGE: ".font-claude-message",

    // Streaming indicator — Claude shows this while a response is still being
    // generated. Capture is blocked when this is present so the transcript
    // isn't truncated mid-response.
    STREAMING: '[data-is-streaming="true"], .result-streaming',
  };

  function matches(url) {
    return SEL.CONVERSATION_URL.test(url || "");
  }

  function getConversationId(url) {
    const m = (url || "").match(SEL.CONVERSATION_URL);
    return m ? m[1] : null;
  }

  function extract() {
    const url = location.href;
    const conversation_id = getConversationId(url);
    if (!conversation_id) {
      throw new Error(
        "Not on a Claude conversation page (expected claude.ai/chat/<id>).",
      );
    }

    // Block capture while Claude is still generating — the last response would
    // be truncated, giving Gemini an incomplete transcript to work with.
    if (document.querySelector(SEL.STREAMING)) {
      throw new Error(
        "Claude is still responding. Wait for it to finish, then capture.",
      );
    }

    // querySelectorAll returns nodes in document order, so a combined query
    // gives us the turns already interleaved in conversation order.
    const combined = `${SEL.USER_MESSAGE}, ${SEL.ASSISTANT_MESSAGE}`;
    const nodes = Array.from(document.querySelectorAll(combined));

    const messages = [];
    for (const node of nodes) {
      const role = node.matches(SEL.USER_MESSAGE) ? "user" : "assistant";
      const content = (node.innerText || "").trim();
      if (content) messages.push({ role, content });
    }

    if (messages.length === 0) {
      throw new Error(
        "No messages found — Claude's DOM may have changed. " +
          "Update the selectors at the top of providers/claude.js.",
      );
    }

    return { provider: "claude", conversation_id, messages };
  }

  window.IdearyExtractors = window.IdearyExtractors || {};
  window.IdearyExtractors.claude = { matches, extract };
})();
