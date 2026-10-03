# Public reading material

`_data/public_reading_sources.json` records the selected public source files, their immutable GitHub revisions, download paths and SHA-256 hashes. The readers in `library/sources/` are captured editions, reached from the existing example guides; they are not another top-level Library category. Their capture date is explicit. Live foray scope files are linked directly where their Pages deployment already serves them.

Original downloads retain their bytes, including notebook code and saved outputs. Markdown downloads end in `.md.txt` to keep Jekyll from rewriting them; the reader's download attribute restores the original filename. Existing byte-identical pictures are reused. The two approximately 43 MB films are the already-linked historical demonstrations; they are download-only, never loaded at page entrance.

Readers adapt internal links and present notebook cells without running them. Saved HTML outputs retain safe text/table/image elements; scripts, styles, frames and event handlers are excluded. Long outputs are disclosed on demand. Missing datasets, historical claims, permissions and known defects remain visible. Preserving a file does not reproduce its analysis or grant additional data rights.

To refresh a captured edition, inspect the upstream change first. Retrieve only specifically selected public material, compare hashes, review for secrets and unintended private material, update the original download and readable edition together, then update the manifest and capture wording. Check newly linked dependencies. Do not silently overwrite a historical result with a rerun or revive intentionally removed framework material.

Run `node tests/public-reading-sources.test.cjs` and, after Jekyll builds, `node tests/public-reading-sources.test.cjs _site`. These check original bytes, notebook cells and saved images, real authoring folders, reader destinations and fragments. Also run the agent generator/checks if source-reading routes change. Nothing in this change makes a repository private.

Remaining GitHub links are optional repository/code access, pinned provenance, historical article references, or unselected older material explicitly left in its source repository. Public forks retain their existing links. This is a preparation pass for the main site's selected reading routes, not a claim that every link inside every independent foray has been audited.
