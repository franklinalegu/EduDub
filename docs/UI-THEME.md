# UI theme

- **Typography (same as PlaylistVault):** `Outfit` body + `Space Grotesk` display, headings `letter-spacing: -0.04em`.
- **Colours (changed):** indigo/violet/cyan → **green gradients**:
  - accent `#6366F1` → emerald `#22C55E` scale (`tailwind.config.js`, `:root --accent`);
  - backgrounds navy → green-black (`#04120A / #071A0E`);
  - primary button `linear 135deg #16A34A → #22C55E → #4ADE80`;
  - progress `linear 90deg #A3E635 → var(--accent) → #14B8A6`;
  - badges `V6·NEO violet` → `E1·EDU emerald/lime`.
- **Motion (same = smooth):** page `fade-up 0.32s [0.22,1,0.36,1]`, toggles `spring 520/32`, progress `0.35s easeOut`, buttons `active:scale-[0.985]`, skeleton shimmer.
- Components (`PageShell, ProgressBar, Toggle, glass, surface, input, chip`) keep identical layout — only color tokens change.
