#!/usr/bin/env node
import { Command } from "commander";
import { connectStitchClient, listStitchTools, DEFAULT_STITCH_MCP_URL } from "./stitchClient.js";

const program = new Command();

program
  .name("artiva")
  .description("CLI for calling the Stitch MCP server (https://stitch.googleapis.com/mcp)")
  .version("0.1.0");

/** Shared flags for every subcommand that talks to the server. */
function withConnectionOptions(cmd: Command): Command {
  return cmd
    .option("-u, --url <url>", "Stitch MCP server URL", DEFAULT_STITCH_MCP_URL)
    .option(
      "-H, --header <key:value...>",
      "extra HTTP header to send, repeatable (e.g. -H \"Authorization:Bearer xyz\")",
    );
}

function parseHeaders(raw: string[] | undefined): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const entry of raw ?? []) {
    const idx = entry.indexOf(":");
    if (idx === -1) {
      throw new Error(`Invalid --header value "${entry}", expected "Key:Value"`);
    }
    headers[entry.slice(0, idx).trim()] = entry.slice(idx + 1).trim();
  }
  return headers;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

withConnectionOptions(
  program.command("list-tools").description("list the tools the Stitch MCP server exposes"),
).action(async (opts) => {
  const client = await connectStitchClient({ url: opts.url, headers: parseHeaders(opts.header) });
  try {
    printJson(await listStitchTools(client));
  } finally {
    await client.close();
  }
});

withConnectionOptions(
  program
    .command("call-tool <name>")
    .description("call a Stitch MCP tool by name")
    .option("-a, --args <json>", "JSON object of arguments to pass to the tool", "{}"),
).action(async (name: string, opts) => {
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(opts.args);
  } catch (err) {
    console.error(`--args must be valid JSON: ${(err as Error).message}`);
    process.exitCode = 1;
    return;
  }

  const client = await connectStitchClient({ url: opts.url, headers: parseHeaders(opts.header) });
  try {
    printJson(await client.callTool({ name, arguments: args }));
  } finally {
    await client.close();
  }
});

withConnectionOptions(
  program.command("list-resources").description("list resources exposed by the Stitch MCP server"),
).action(async (opts) => {
  const client = await connectStitchClient({ url: opts.url, headers: parseHeaders(opts.header) });
  try {
    printJson(await client.listResources());
  } finally {
    await client.close();
  }
});

withConnectionOptions(
  program.command("read-resource <uri>").description("read a resource by URI from the Stitch MCP server"),
).action(async (uri: string, opts) => {
  const client = await connectStitchClient({ url: opts.url, headers: parseHeaders(opts.header) });
  try {
    printJson(await client.readResource({ uri }));
  } finally {
    await client.close();
  }
});

withConnectionOptions(
  program.command("list-prompts").description("list prompts exposed by the Stitch MCP server"),
).action(async (opts) => {
  const client = await connectStitchClient({ url: opts.url, headers: parseHeaders(opts.header) });
  try {
    printJson(await client.listPrompts());
  } finally {
    await client.close();
  }
});

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
