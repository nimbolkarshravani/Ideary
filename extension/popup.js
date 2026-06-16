/**
 * Popup UI controller.
 *
 * Flow on click:
 *   1. ask the content script to extract the conversation
 *   2. hand the payload to the background worker to POST to Ideary
 *   3. show success (with a deep link) or an error
 */

const IDEARY_BASE = "https://ideary.vercel.app";

// Mirror of providers/claude.js CONVERSATION_URL — used to gate the button.
const CLAUDE_CONVERSATION = /^https:\/\/claude\.ai\/chat\/[0-9a-fA-F-]+/;

const captureBtn = document.getElementById("capture");
const statusEl = document.getElementById("status");

function setStatus(html, kind) {
  statusEl.className = kind || "";
  statusEl.innerHTML = html;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isClaudeConversation(url) {
  return CLAUDE_CONVERSATION.test(url || "");
}

// ── Gate the button to Claude conversation pages ────────────────────────────
async function init() {
  const tab = await getActiveTab();
  if (!isClaudeConversation(tab && tab.url)) {
    captureBtn.disabled = true;
    captureBtn.textContent = "open a Claude conversation to capture";
  }
}

// ── Capture flow ────────────────────────────────────────────────────────────
captureBtn.addEventListener("click", async () => {
  captureBtn.disabled = true;
  setStatus("capturing your thinking…", "loading");

  try {
    const tab = await getActiveTab();

    // 1. Extract from the page.
    let extractRes;
    try {
      extractRes = await chrome.tabs.sendMessage(tab.id, {
        type: "IDEARY_EXTRACT",
      });
    } catch {
      throw new Error(
        "Couldn't reach the page. Reload the Claude tab and try again.",
      );
    }
    if (!extractRes || !extractRes.ok) {
      throw new Error(
        (extractRes && extractRes.error) || "Could not read the conversation.",
      );
    }

    // Show what was captured so a selector failure is immediately visible.
    const d = extractRes.data._debug || {};
    const assistantCount = d.assistantCount || 0;
    const totalCount = (d.userCount || 0) + assistantCount;
    const countLine = assistantCount === 0
      ? `⚠ ${d.userCount || 0} user messages, 0 assistant — selector may be wrong`
      : `${totalCount} messages (${d.userCount} user + ${assistantCount} assistant)`;
    setStatus(countLine + "<br/>saving your eureka…", "loading");

    // 2. Send to Ideary.
    const importRes = await chrome.runtime.sendMessage({
      type: "IDEARY_IMPORT",
      payload: extractRes.data,
    });
    if (!importRes || !importRes.ok) {
      throw new Error((importRes && importRes.error) || "Import failed.");
    }

    // 3. Success.
    if (importRes.status === "extraction_failed") {
      // The raw conversation was saved, but Gemini couldn't structure it.
      setStatus(
        "Saved the conversation, but couldn't generate the Eureka. Try again in a moment.",
        "error",
      );
      captureBtn.disabled = false;
      return;
    }

    const verb = importRes.status === "updated" ? "updated" : "saved";
    const link = `${IDEARY_BASE}/eureka/${importRes.eureka_id}`;
    setStatus(
      `✓ Eureka ${verb}<br /><a href="${link}" target="_blank" rel="noopener">open in Ideary →</a>`,
      "success",
    );
  } catch (err) {
    setStatus(err && err.message ? err.message : String(err), "error");
    captureBtn.disabled = false;
  }
});

init();
