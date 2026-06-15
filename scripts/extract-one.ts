import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import { extractEureka } from "../lib/extract";

/**
 * Run extraction on a single real conversation and print the Eureka JSON.
 *
 * Usage:
 *   npm run extract -- path/to/conversation.txt
 *   cat conversation.txt | npm run extract
 */
async function main() {
  const fileArg = process.argv[2];

  let conversation: string;
  if (fileArg) {
    if (!fs.existsSync(fileArg)) {
      console.error(`File not found: ${fileArg}`);
      process.exit(1);
    }
    conversation = fs.readFileSync(fileArg, "utf-8");
  } else if (!process.stdin.isTTY) {
    conversation = fs.readFileSync(0, "utf-8"); // read stdin
  } else {
    console.error("Usage: npm run extract -- <conversation-file>");
    console.error("   or: cat conversation.txt | npm run extract");
    process.exit(1);
  }

  conversation = conversation.trim();
  if (!conversation) {
    console.error("Empty conversation.");
    process.exit(1);
  }

  console.error(`\nExtracting Eureka from ${conversation.length} chars of conversation...\n`);

  const eureka = await extractEureka(conversation);

  // JSON goes to stdout so it can be piped/redirected; status line to stderr
  console.log(JSON.stringify(eureka, null, 2));
  console.error(`\n✓ Done — status: ${eureka.status}, title: "${eureka.title}"\n`);
}

main().catch((err) => {
  console.error("Extraction failed:", err);
  process.exit(1);
});
