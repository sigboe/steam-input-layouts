# Steam Input layouts

Curated Steam Input controller layouts, one catalogue per game. Clients read
a catalogue straight from this repository, so a catalogue changes without an
app release.

| Folder | Read by |
| --- | --- |
| [`wow/`](wow/catalogue.json) | [WoWDeck](https://github.com/sigboe/wowdeck), the World of Warcraft addon manager for Steam Deck |

## What gets in

A catalogue lists only layouts already published on Steam. Maintainers review
every revision before it appears. When an author changes a layout, the new
revision needs another review. Listing a revision never changes anyone's
controls. A player applies it by choice.

A withdrawn revision stays in the history with `"withdrawn": true`. Clients
stop offering it, and players already using it keep their controls.

This repository does not take submissions yet.

## Catalogue format

`<game>/catalogue.json`, schema version 1:

```json
{
  "schemaVersion": 1,
  "layouts": [
    {
      "id": "stable-layout-id",
      "title": "Layout title",
      "author": "Steam author name",
      "description": "Optional.",
      "controllerType": "controller_neptune",
      "publishedFileId": "3810861852",
      "revisions": [
        { "number": 1, "sha256": "<64 hex>", "contentFormat": 1 },
        { "number": 2, "sha256": "<64 hex>", "contentFormat": 1, "withdrawn": true }
      ]
    }
  ]
}
```

- `id` never changes after its first release. The order of `layouts` is the order players see.
- `publishedFileId` is the Steam Workshop item. Approval belongs to the revision's `sha256`, not to the item, because the author can change the item after review.
- `revisions` lists every approved revision, oldest first.
- `metrics` and `provenance` are optional. Leave a value out rather than writing 0.

A client offers the newest revision that is not withdrawn and whose
`contentFormat` it understands. Raise `schemaVersion` only for a change older
clients cannot read; they then show a "needs a newer version" message instead
of guessing.

## Checks

Every push and pull request runs `scripts/validate.ts` with WoWDeck's own
catalogue parser, pinned in `.github/workflows/validate.yml`. It fails when
WoWDeck could not read a catalogue or would drop one of its layouts. To run it
locally:

```bash
bun scripts/validate.ts ../wowdeck
```
