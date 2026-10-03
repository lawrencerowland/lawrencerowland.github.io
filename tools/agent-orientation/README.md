# Agent orientation

Run `node tools/agent-orientation/generate.cjs` after changing the public catalogues or `_data/agent_orientation.json`. Commit the generated files. `--check` rejects stale output. The generator uses Node built-ins and Ruby's existing YAML parser; no new packages are needed.

The human home is `/sitemap.html#for-agents`. The generated include keeps the fuller project table, Library notes and picture guidance inside native details. The existing sitemap tree remains below it. HTML uses Jekyll's `relative_url` for this site's routes so previews stay on their own host; Markdown uses absolute public URLs.

`agents/overview.txt`, `agents/directory.txt` and `agents/visual-atlas.txt` have `layout: null` and explicit permalinks to `/llms.txt`, `/agents/directory.md` and `/agents/visual-atlas.md`. This publishes Markdown bytes without Jekyll's Markdown-to-HTML conversion. The old `LLMs.txt` is the same overview body, generated separately so the source tree works on case-insensitive filesystems. Do not create a second root source named `llms.txt`.

Project names, questions, scenarios, approaches and concepts come from `side_projects.yml`; limits are short editorial reading boundaries keyed by the same IDs. Public scope links point to each project's own material. The guide does not transfer research direction to the main site. Library subjects and counts come from the Library catalogues, and the visual guide preserves each `visualisations.json` caption, state, limitation, image and source destination. Captured dates are not fresh verification claims.

Run `node tests/agent-orientation.test.cjs` and, after Jekyll builds, `node tests/agent-orientation.test.cjs _site`. The built checks verify the published Markdown bytes, both llms paths, rendered guide and discovery links. The public scope URLs were checked against the public repository files on 3 October 2026; regenerate metadata, not a copied central research plan, when those scopes change.
