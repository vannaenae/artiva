import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
import type { ListToolsRequest, ListToolsResult } from "@modelcontextprotocol/sdk/types.js";

export const DEFAULT_STITCH_MCP_URL = "https://stitch.googleapis.com/mcp";

export interface ConnectOptions {
  /** Override the MCP server URL. Defaults to STITCH_MCP_URL env var or DEFAULT_STITCH_MCP_URL. */
  url?: string;
  /** Extra HTTP headers to send with every request (e.g. --header Foo:bar), merged over the auth headers below. */
  headers?: Record<string, string>;
}

/**
 * Builds the auth headers Stitch (a Google API) expects, from environment
 * variables, so credentials never need to be passed on the command line.
 *
 *  - STITCH_ACCESS_TOKEN / GOOGLE_ACCESS_TOKEN -> "Authorization: Bearer <token>"
 *  - STITCH_API_KEY / GOOGLE_API_KEY           -> "x-goog-api-key: <key>"
 *
 * Both may be set at once; an explicit --header flag always wins over either.
 */
function authHeadersFromEnv(): Record<string, string> {
  const headers: Record<string, string> = {};

  const accessToken = process.env.STITCH_ACCESS_TOKEN ?? process.env.GOOGLE_ACCESS_TOKEN;
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const apiKey = process.env.STITCH_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (apiKey) {
    headers["x-goog-api-key"] = apiKey;
  }

  return headers;
}

/**
 * Connects to the Stitch MCP server and returns a ready-to-use MCP client.
 * Callers are responsible for calling `client.close()` when done.
 */
export async function connectStitchClient(options: ConnectOptions = {}): Promise<Client> {
  const url = options.url ?? process.env.STITCH_MCP_URL ?? DEFAULT_STITCH_MCP_URL;

  const headers: Record<string, string> = {
    ...authHeadersFromEnv(),
    ...(options.headers ?? {}),
  };

  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: {
      headers,
    },
  });

  const client = new Client({
    name: "artiva-stitch-cli",
    version: "0.1.0",
  });

  try {
    await client.connect(transport);
  } catch (err) {
    const hint =
      Object.keys(headers).length === 0
        ? " No credentials were set (STITCH_ACCESS_TOKEN / STITCH_API_KEY). Stitch likely requires one of these."
        : "";
    throw new Error(`Failed to connect to Stitch MCP server at ${url}: ${(err as Error).message}.${hint}`);
  }

  return client;
}

/**
 * Lists tools without going through `Client.listTools()`.
 *
 * The SDK's `listTools()` eagerly pre-compiles an ajv validator for every
 * tool's `outputSchema` (for later use validating `callTool` results). At
 * least some of Stitch's advertised output schemas use `$ref`s (e.g.
 * `#/$defs/ScreenInstance`) that don't resolve within their own tool schema,
 * which makes that pre-compilation throw and takes down the whole call. This
 * issues the raw `tools/list` request instead, skipping that step — output
 * validation on `callTool` is simply skipped as a result, which is fine for
 * a CLI that just prints whatever the server returns.
 */
export async function listStitchTools(
  client: Client,
  params?: ListToolsRequest["params"],
): Promise<ListToolsResult> {
  return client.request({ method: "tools/list", params }, ListToolsResultSchema);
}
