# Ideary Chrome Extension

Capture a Claude conversation and turn it into a structured **Eureka** in
[Ideary](https://ideary.vercel.app) with one click.

## What it does

1. Runs on `claude.ai` conversation pages.
2. Reads the current conversation from the page (user + Claude turns).
3. POSTs it to the Ideary import endpoint, which uses Gemini to extract a
   structured Eureka (spark, case for/against, verdict, …).
4. Gives you a link straight to the new Eureka.

Claude only for now. The extractor interface is provider-agnostic, so
ChatGPT and Gemini can be added later (see `providers/claude.js`).

## Load it (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked**.
4. Select this `extension/` directory.

The Ideary lightbulb appears in your toolbar. Pin it for easy access.

## Use it

1. Open a Claude conversation: `https://claude.ai/chat/<id>`.
2. Click the Ideary icon → **💡 Save as Eureka**.
3. Wait for **✓ Eureka saved**, then click **open in Ideary →**.

Re-capturing the same conversation updates the existing Eureka instead of
creating a duplicate (matched on `provider` + `conversation_id`).

If the button reads *"open a Claude conversation to capture"*, you're not on a
`claude.ai/chat/...` page.

## Files

| File                  | Role                                                        |
| --------------------- | ----------------------------------------------------------- |
| `manifest.json`       | Manifest V3 config (permissions, content scripts, popup).   |
| `providers/claude.js` | Claude DOM extractor. **All fragile selectors live here.**  |
| `content.js`          | Picks the right provider and answers extract requests.      |
| `background.js`       | Service worker; POSTs to the Ideary import endpoint.        |
| `popup.html`          | Popup markup + styles.                                      |
| `popup.js`            | Popup controller (extract → import → show result).          |

## When capture breaks

Claude's DOM changes from time to time. If capture stops finding messages,
fix the selectors at the top of [`providers/claude.js`](providers/claude.js) —
they're isolated in a single `SEL` block specifically for this.

## Adding another provider

1. Create `providers/<name>.js` that registers
   `window.IdearyExtractors.<name> = { matches(url), extract() }`
   following the same contract as `claude.js`.
2. Add it to the `content_scripts[0].js` array in `manifest.json` (before
   `content.js`) and add the site to `matches` + `host_permissions`.
