# artiva

A Node.js/TypeScript command-line client for the [Stitch](https://stitch.withgoogle.com/) MCP
server at `https://stitch.googleapis.com/mcp`. It connects over Streamable HTTP using the
[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and lets you list
and invoke whatever tools, resources, and prompts the server exposes, straight from the terminal.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your credentials
npm run build
```

## Authentication

Stitch is a Google API and requires credentials. Set one of these in `.env` (or export them in
your shell) before running any command:

- `STITCH_ACCESS_TOKEN` — an OAuth2 access token, sent as `Authorization: Bearer <token>`
- `STITCH_API_KEY` — a Google API key, sent as `x-goog-api-key: <key>`

`GOOGLE_ACCESS_TOKEN` / `GOOGLE_API_KEY` are accepted as fallback names if you already have those
set for other Google tooling.

You can also pass ad hoc headers per-invocation with `--header "Key:Value"` (repeatable), which
take precedence over the environment variables.

## Usage

Run via the built CLI:

```bash
npm run build
npm start -- list-tools
```

or directly against source during development:

```bash
npm run dev -- list-tools
```

### Commands

```bash
# Discover what the server can do
artiva list-tools
artiva list-resources
artiva list-prompts

# Call a tool by name with JSON arguments
artiva call-tool <tool-name> --args '{"prompt": "a login screen for a fitness app"}'

# Read a resource by URI
artiva read-resource <uri>
```

Every command accepts `-u, --url <url>` to point at a different MCP server, and
`-H, --header <key:value>` (repeatable) to attach extra HTTP headers.

Exact tool names and their argument shapes are defined by the Stitch MCP server itself — run
`artiva list-tools` first to see what's currently available and what arguments each tool expects.
As of this writing, the server exposes:

| Tool | What it does |
| --- | --- |
| `create_project` | Creates a new Stitch project (a container for UI designs and frontend code). |
| `get_project` | Retrieves a project by name. |
| `delete_project` | Deletes a project by name. |
| `list_projects` | Lists projects accessible to the user. |
| `list_screens` | Lists all screens within a project. |
| `get_screen` | Retrieves a specific screen within a project. |
| `generate_screen_from_text` | Generates a new screen from a text prompt. |
| `edit_screens` | Edits existing screens using a text prompt. |
| `generate_variants` | Generates variants of existing screens using a text prompt. |
| `upload_design_md` | Uploads a `DESIGN.md` file to build a design system. |
| `create_design_system` | Creates a design system (visual theme/style/branding) for a project. |
| `create_design_system_from_design_md` | Creates a design system from an uploaded `DESIGN.md`. |
| `update_design_system` | Updates an existing design system. |
| `list_design_systems` | Lists design systems for a project. |
| `apply_design_system` | Applies a design system to one or more screens. |

Every tool call requires authentication — without valid credentials the server responds with:
`Request is missing required authentication credential. Expected OAuth 2 access token, login
cookie or other valid authentication credential.` (`list-tools` itself does not require auth,
so it's a good way to sanity-check connectivity before wiring up credentials.)

### Note on tool output schemas

Some of Stitch's declared `outputSchema`s use `$ref`s (e.g. `#/$defs/ScreenInstance`) that don't
resolve within their own schema document. The default MCP SDK client eagerly compiles an ajv
validator for every tool's `outputSchema` inside `listTools()`, which throws on these. This CLI
works around it by issuing the raw `tools/list` request (see `listStitchTools` in
`src/stitchClient.ts`) instead of using the SDK's `Client.listTools()` wrapper, at the cost of
skipping the SDK's automatic output-schema validation on `call-tool` results.
