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
 *   extract(): { provider, conversation_id, messages, _debug }
 *       — reads the conversation from the DOM. Throws an Error (with a
 *         human-readable message) if it can't. `messages` is an ordered
 *         array of { role: "user" | "assistant", content: string }.
 *         `_debug` carries counts for display in the popup.
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

    // A single Claude (assistant) turn.
    // We try several selectors; the first one that yields results wins.
    // When Claude changes its DOM, add the new selector to the front of this list.
    ASSISTANT_MESSAGE_CANDIDATES: [
      '.font-claude-message',          // used in 2024-2025
      '[data-testid="ai-message"]',    // seen in some versions
      '[data-testid="assistant-message"]',
      '.claude-message',
      '[data-is-claude="true"]',
    ],

    // Streaming indicator — Claude shows this while a response is still being
    // generated. Capture is blocked when this is present so the transcript
    // isn't truncated mid-response.
    STREAMING: '[data-is-streaming="true"], .result-streaming, [data-loading="true"]',
  };

  function matches(url) {
    return SEL.CONVERSATION_URL.test(url || "");
  }

  function getConversationId(url) {
    const m = (url || "").match(SEL.CONVERSATION_URL);
    return m ? m[1] : null;
  }

  /** Return the first selector candidate that matches at least one element. */
  function findAssistantSelector() {
    for (const sel of SEL.ASSISTANT_MESSAGE_CANDIDATES) {
      if (document.querySelector(sel)) return sel;
    }
    return null;
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

    const assistantSel = findAssistantSelector();

    // Build message list from user turns first to check we have something.
    const userNodes = Array.from(document.querySelectorAll(SEL.USER_MESSAGE));
    const assistantNodes = assistantSel
      ? Array.from(document.querySelectorAll(assistantSel))
      : [];

    // Merge all nodes in document order with their known role.
    const taggedNodes = [
      ...userNodes.map((n) => ({ node: n, role: "user" })),
      ...assistantNodes.map((n) => ({ node: n, role: "assistant" })),
    ].sort((a, b) => {
      const pos = a.node.compareDocumentPosition(b.node);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    const messages = [];
    for (const { node, role } of taggedNodes) {
      const content = (node.innerText || "").trim();
      if (content) messages.push({ role, content });
    }

    if (messages.length === 0) {
      throw new Error(
        "No messages found — Claude's DOM may have changed. " +
          "Check the console for debug info, or update the selectors in providers/claude.js.",
      );
    }

    const userCount = messages.filter((m) => m.role === "user").length;
    const assistantCount = messages.filter((m) => m.role === "assistant").length;

    console.log(
      `[Ideary] Captured ${messages.length} messages — ${userCount} user, ${assistantCount} assistant. ` +
      `Assistant selector: ${assistantSel || "NONE — only user messages captured!"}`,
    );

    return {
      provider: "claude",
      conversation_id,
      messages,
      _debug: { userCount, assistantCount, assistantSel },
    };
  }

  window.IdearyExtractors = window.IdearyExtractors || {};
  window.IdearyExtractors.claude = { matches, extract };
})();
