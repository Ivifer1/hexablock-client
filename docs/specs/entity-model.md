# Entity model (glossary) — client

Status: Draft. Shared vocabulary for specs, code and tests. Names come from the brief; structure and relations are a team decision
(record them in ADRs and the class diagram).

| Term | Meaning |
| --- | --- |
| HexCoord | A cell position in axial coordinates (q, r). |
| Axis | One of the 3 line directions of a hexagonal grid. |
| Direction | One of the 6 neighbour directions (slides in Hexa Merge). |
| BoardShape | The set of valid cells: hexagon of radius N or an arbitrary figure (Hexa Fit). |
| HexBoard<TCell> | The board: a shape plus the content of each cell. |
| Cell content (TCell) | Color (Lines), PieceId (Fit), ColorStack (Sort), number (Merge). |
| Piece | A poly-hex of 1–5 cells that can be rotated in 60° steps. |
| ColorStack | An ordered stack of coloured tiles in one cell (Hexa Sort). |
| Tile | A numbered power-of-two token (Hexa Merge). |
| Move (TMove) | Place piece, place/remove/rotate piece, place stack, or slide in a direction. |
| GameState (TState) | Board + tray/piece source state + score + status of one game. |
| Tray | The pieces currently offered to the player. |
| Level | A predefined starting setup with goals (Fit, Sort). |
| Goal | A target to meet in a level (e.g. stacks cleared). |
| Score / HighScore | Points of a game / best score of an endless variant. |
| Stars | 0–3 rating of a completed level. |
| Progress | Per-variant record of levels completed, stars and scores. |
| Variant (gameId) | Hexa Lines, Hexa Fit, Hexa Sort, Hexa Merge (and future ones). |
